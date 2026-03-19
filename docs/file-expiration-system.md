# Sistema de Expiración Automática de Archivos

> Documentación técnica del sistema de limpieza automática de archivos del media-backend.

## Tabla de Contenidos

1. [Conceptos Básicos](#1-conceptos-básicos)
   - [¿Qué problema resuelve?](#11-qué-problema-resuelve-este-sistema)
   - [Tipos de Expiración](#12-tipos-de-expiración)
2. [Los Tres Actores del Sistema](#2-los-tres-actores-del-sistema)
   - [El Archivo (FileModel)](#21-el-archivo-filemodel)
   - [El Usuario (UserStorageModel)](#22-el-usuario-userstoragemodel)
   - [El Reloj/Calculadora](#23-el-relojcalculadora)
 3. [Cómo Funciona el Cleanup](#3-cómo-funciona-el-cleanup-paso-a-paso)
   - [El Startup](#31-el-startup-cómo-se-inicia-todo)
   - [El Ciclo del Scheduler](#32-el-ciclo-del-scheduler)
   - [El Límite Técnico de setTimeout](#33-el-límite-técnico-de-settimeout)
   - [Reinicios Frecuentes](#34-reinicios-frecuentes)
   - [Tabla de Edge Cases](#35-tabla-de-edge-cases)
   - [Casos de Prueba Conceptuales](#36-casos-de-prueba-conceptuales)
   - [Diagrama de Estados](#37-diagrama-de-estados)
   - [Comparación: Scheduler vs Cron](#38-comparación-este-scheduler-vs-cron-del-sistema)
   - [Recomendaciones de Producción](#39-recomendaciones-de-producción)
   - [Cálculo de Próxima Expiración](#310-cálculo-de-próxima-expiración)
4. [La Eliminación Real](#4-la-eliminación-real-del-archivo)
   - [Función _robustDelete](#41-qué-significa-robustdelete)
   - [Eliminación en Paralelo](#42-eliminación-en-paralelo)
5. [Sistema de Eventos](#5-eventos-cómo-el-sistema-se-entera-de-cambios)
   - [Patrón EventEmitter](#51-el-patrón-eventemitter)
   - [Cuándo se emite expirationChanged](#52-cuándo-se-emite-expirationchanged)
   - [Tabla Resumida de Eventos](#53-tabla-resumida-de-eventos)
   - [Principio de Coherencia](#54-principio-de-coherencia-explicado)
6. [Variables de Entorno](#6-variables-de-entorno)
   - [Lista Completa](#61-lista-completa)
   - [Ejemplos de Uso](#62-ejemplos-de-uso)
7. [Guía para Probar](#7-guía-para-probar-el-sistema)
   - [Expiración por Política](#71-escenario-quiero-que-al-subir-un-archivo-se-borre-en-1-día)
   - [Expiración por Fecha Explícita](#72-escenario-quiero-probar-expiración-por-fecha-explícita)
8. [Troubleshooting](#8-troubleshooting)
   - [Archivo no se borra](#81-el-archivo-no-se-borra-aunque-debería)
   - [Política no surte efecto](#82-cambié-la-política-pero-no-pasa-nada)
   - [Archivos de otro proyecto](#83-tengo-archivos-de-otro-proyectodirectorio)
9. [Arquitectura Detallada](#9-arquitectura-detallada)
   - [Diagrama de Componentes](#91-diagrama-de-componentes)
   - [Flujo de Datos](#92-flujo-de-datos-completo)
10. [Índices de MongoDB](#10-índices-de-mongodb)

---

## 1. Conceptos Básicos

### 1.1 ¿Qué problema resuelve este sistema?

Imagina que tienes un servidor con 100GB de espacio. Los usuarios suben archivos sin pensar en el espacio. En 2 años tendrías 500GB de archivos ocupando el disco, la mayoría innecesarios.

**Solución**: Que los archivos "mueran" después de un tiempo:

- Archivos a los que nadie accede → se borran
- Archivos que cumplieron su propósito → se borran

### 1.2 Tipos de Expiración

| Tipo | Campo en DB | Descripción | Ejemplo |
|------|-------------|-------------|---------|
| **Explícita** | `expirationDate` | Fecha fija definida por el usuario | "Este archivo muere el 25 de diciembre" |
| **Por Política** | `expirationDate = null` | Calculada dinámicamente | "Muere 30 días después del último acceso" |

#### Ejemplo: Fecha Explícita

```
El usuario dice: "Este archivo muere el 25 de diciembre"

Campo: expirationDate = "2026-12-25T00:00:00Z"

Uso típico: Subiste una foto del evento de fin de año.
Le pones que expire el 2 de enero. Después ya no la necesitas.
```

#### Ejemplo: Por Política

```
El usuario configura: fileExpirationTime = 30 días, deleteByLastAccess = true

El sistema calcula: "Este archivo murió 30 días después del último acceso"

Uso típico: Archivos que nadie mira durante 30 días → se borran automáticamente.
```

---

## 2. Los Tres Actores del Sistema

### 2.1 El Archivo (FileModel)

Cada archivo en la DB tiene estos campos relevantes para la expiración:

```javascript
{
    _id: ObjectId("6872..."),
    filename: "foto.png",
    
    // ¿Cuándo se creó?
    createdAt: "2026-03-19T10:00:00Z",
    
    // ¿Cuándo se accedió por última vez?
    // Se actualiza automáticamente cuando alguien descarga/ve el archivo
    lastAccess: "2026-03-19T12:30:00Z",
    
    // Fecha de expiración FIJA (opcional)
    // - Si tiene valor → el archivo muere en esa fecha exacta
    // - Si es null → el archivo muere según la política del usuario
    expirationDate: null,
    
    // ¿Quién lo subió?
    createdBy: {
        user: ObjectId("6570..."),  // ID del usuario
        username: "admin"
    }
}
```

#### ¿Por qué `lastAccess` existe?

Imagina que subes un archivo el lunes. Si lo bajas el martes para usarlo, ¿debería "morir" el lunes (cuando se creó) o el martes (cuando lo usaste por última vez)?

| Configuración | Comportamiento |
|--------------|----------------|
| `deleteByLastAccess = true` | Muere X días después del **ÚLTIMO acceso** |
| `deleteByLastAccess = false` | Muere X días después de la **CREACIÓN** |

### 2.2 El Usuario (UserStorageModel)

Cada usuario tiene una configuración de almacenamiento:

```javascript
{
    _id: ObjectId("..."),
    user: ObjectId("6570..."),  // Referencia al usuario
    
    // Límites
    capacity: 2048,        // 2GB máximo
    usedSpace: 512,        // Está usando 512MB
    maxFileSize: 100,      // Archivos de hasta 100MB
    
    // CONFIGURACIÓN DE EXPIRACIÓN
    fileExpirationTime: 30,  // Archivos viven 30 días
    
    // ¿Cómo medir los 30 días?
    deleteByLastAccess: true,   // true = desde último acceso
    //                            // false = desde creación
    deleteByCreatedAt: false,   // Mutuamente excluyente con deleteByLastAccess
    
    filesPrivacy: 'private'  // Por defecto, archivos son privados
}
```

#### Ejemplo de Cálculo

```
Usuario configurado:
  fileExpirationTime = 30 días
  deleteByLastAccess = true

Archivo sube: 2026-03-01 10:00
Usuario accede: 2026-03-05 14:00

Cálculo de expireAt:
  expireAt = lastAccess + fileExpirationTime
           = 2026-03-05 14:00 + 30 días
           = 2026-04-04 14:00

El archivo morirá el 2026-04-04 a las 14:00
```

### 2.3 El Reloj/Calculadora

Este es el componente invisible. Su trabajo es:

1. Calcular cuándo es la próxima expiración
2. Esperar hasta ese momento
3. Ejecutar el cleanup
4. Volver al paso 1

---

## 3. Cómo Funciona el Cleanup Paso a Paso

### 3.1 El Startup: ¿Cómo se inicia todo?

Cuando inicias el servidor, pasa esto:

```
┌─────────────────────────────────────────────────────────────────┐
│  index.js se carga                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  import { startFileCleanupJob } from './services/FileCleanupJob'  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  startFileCleanupJob()                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  new CleanupScheduler() → Se crea el scheduler                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  scheduler.schedule() → Comienza el ciclo                        │
└─────────────────────────────────────────────────────────────────┘
```

**¿Por qué se hace al iniciar?**

Porque Node.js no tiene un "cron" nativo. El scheduler usa `setTimeout()` para esperar hasta la próxima expiración. Al iniciar, necesita calcular qué expirará primero.

### 3.2 El Ciclo del Scheduler

```
┌─────────────────────────────────────────────────────────────────┐
│                    CICLO DEL SCHEDULER                          │
└─────────────────────────────────────────────────────────────────┘

    ┌───────────────────────┐
    │ scheduler.schedule()  │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │ 1. Cleanup inmediato  │    executeCleanup() → Borra archivos YA expirados
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │ 2. Calcular próxima   │    getNextExpirationTimestamp()
    │    expiración         │    → Busca en MongoDB el archivo que expira primero
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │ 3. Programar espera   │    delay = próximaExpiración - ahora
    │                       │    setTimeout(execute, delay)
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │ 4. Esperar...         │    Node.js duerme por 'delay' ms
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │ 5. Se despertó!       │    execute() → Ir a paso 1
    └───────────────────────┘
```

### 3.3 El Límite Técnico de setTimeout

Node.js `setTimeout` tiene un límite de ~24.8 días (2^31-1 milisegundos). Esto es una limitación técnica del runtime de V8.

**¿Cómo lo maneja el sistema?**

```javascript
const MAX_NODE_TIMEOUT = 2147483647  // ≈ 24.8 días
const safeDelay = Math.min(delay, this.MAX_NODE_TIMEOUT)
setTimeout(callback, safeDelay)
```

**Flujo para expiración de 365 días:**

```
Archivo creado: día 0
Expira: día 365

Ciclo 1: programa cleanup en 24.8 días
  │
  ├─→ Cleanup ejecuta: día 24.8
  │       Archivo NO expiró aún (quedan ~340 días)
  │       Recalcula: próxima expiración en ~340 días
  │
  ├─→ Ciclo 2: programa cleanup en 24.8 días
  │       Cleanup ejecuta: día 49.6
  │       Recalcula: ~315 días restantes
  │
  ├─→ Ciclo 3: programa cleanup en 24.8 días
  │       ...
  │
  └─→ Continúa hasta día ~365
          Archivo expiró → SE BORRA ✓
```

**Resultado:** El archivo se borra exactamente el día 365, sin importar qué tan lejano sea.

### 3.4 Reinicios Frecuentes

El scheduler está diseñado para funcionar correctamente con reinicios frecuentes:

```
┌─────────────────────────────────────────────────────────────────┐
│ AL INICIAR: cleanup.execute(false) se ejecuta SIEMPRE            │
│                                                                  │
│ Esto asegura:                                                   │
│ 1. Archivos que expiraron mientras apagado → se borran          │
│ 2. Archivos vivos → NO se borran por error                      │
└─────────────────────────────────────────────────────────────────┘
```

**Flujo con reinicios:**

```
Día 0: Archivo creado, expira día 365
       └─> Schedule: programa timer para día 365

[Reinicio en día 1]
       ├─> execute(false): cleanup inmediato
       │      Archivo: ¿expired? NO (quedan 364 días)
       │      Resultado: NO se borra ✓
       ├─> getNextExpirationTimestamp(): día 365
       └─> Programa timer para día 365

[Reinicio en día 2]
       ├─> execute(false): cleanup inmediato
       │      Archivo: ¿expired? NO (quedan 363 días)
       │      Resultado: NO se borra ✓
       └─> Programa timer para día 365

... (repite hasta día 365) ...

Día 365: Archivo expira

[Reinicio en día 365+]
       ├─> execute(false): cleanup inmediato
       │      Archivo: ¿expired? SÍ
       │      Resultado: SE BORRA ✓
```

**Conclusión:** Los reinicios frecuentes NO afectan el funcionamiento correcto del sistema.

### 3.5 Tabla de Edge Cases

| Escenario | Comportamiento |
|-----------|---------------|
| **Expiración en 1 hora** | Se programa cleanup en 1 hora |
| **Expiración en 30 días** | Se programa cleanup en 30 días |
| **Expiración en 365 días** | Se divide en ~15 ciclos de 24.8 días |
| **Expiración en 10 años** | Se divide en ~150 ciclos de 24.8 días |
| **Cleanup ya corriendo** | Se salta, espera a que termine |
| **Sin expiraciones pendientes** | Entra en standby, no programa timer |
| **Error en cleanup** | Retry en 1 minuto |
| **Error en schedule()** | Retry en 1 minuto |
| **Archivo accedido cerca de expirar** | Se recalcula inmediatamente |
| **Reinicio frecuente** | Cleanup al inicio no afecta archivos vivos |

### 3.6 Casos de Prueba Conceptuales

#### Caso 1: Archivo con expiración de 30 días (simple)

```
Día 0: Subir archivo, lastAccess = Día 0
       fileExpirationTime = 30 días
       
Día 30: Scheduler programa cleanup para Día 30
        Cleanup ejecuta
        expireAt = Día 0 + 30 = Día 30
        ¿30 <= 30? SÍ → BORRA ✓
```

#### Caso 2: Archivo con expiración de 365 días (múltiples ciclos)

```
Día 0: Subir archivo
       fileExpirationTime = 365 días
       expireAt = Día 365

Scheduler:
  ├─ Día 24.8: ciclo 1, archivo vivo (quedan 340 días)
  ├─ Día 49.6: ciclo 2, archivo vivo (quedan 315 días)
  ├─ ...
  └─ Día 365: ciclo final, archivo expiró → BORRA ✓
```

#### Caso 3: Acceso "rescata" archivo a punto de expirar

```
Día 29: Archivo tiene lastAccess = Día 0
        expireAt = Día 0 + 30 = Día 30
        Quedan 24 horas → está "próximo" (within 12h threshold)

Día 29 (ahora): Usuario descarga archivo
       lastAccess se actualiza a Día 29
       expireAt = Día 29 + 30 = Día 59
       Se emitió expirationChanged → scheduler recalcula

Día 30: Cleanup ejecuta
        expireAt = Día 59, ahora = Día 30
        ¿30 <= 59? NO → NO BORRA ✓

Día 59: Cleanup ejecuta
        expireAt = Día 59, ahora = Día 59
        ¿59 <= 59? SÍ → BORRA ✓
```

#### Caso 4: Archivo expira mientras servidor está apagado

```
Archivo expira: 2026-03-20 15:00:00
Servidor apagado: desde 2026-03-20 14:00:00

Servidor se reinicia: 2026-03-20 16:00:00

Al iniciar:
  ├─> execute(false): cleanup inmediato
  │      Archivo: ¿expired? SÍ (expired a las 15:00, ahora 16:00)
  │      Resultado: SE BORRA ✓
  └─> Programa timer para siguiente expiración
```

#### Caso 5: Error durante cleanup

```
Día X: Cleanup comienza
       Error en base de datos → thrown
        
CleanupJob.catch:
  ├─ Registra error
  └─ Timer: retry en 60 segundos

Día X + 1min: Retry
       ¿Funciona? SÍ → Continúa normalmente
       ¿Falla otra vez? SÍ → Retry en 1 minuto otra vez
```

#### Caso 6: Scheduler deshabilitado

```
MEDIA_FILE_CLEANUP_ENABLED=false

startFileCleanupJob():
  ├─ schedule() llamado
  ├─ isEnabled = false
  └─ stop() llamado
       Timer cancelado
       
El scheduler queda inactivo. No se borra nada.
```

### 3.7 Diagrama de Estados

```
┌──────────────┐
│   INICIAL    │  startFileCleanupJob()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  SCHEDULING │  schedule() ejecutando
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   WAITING    │  setTimeout programado
│  (timer > 0)│  Esperando próxima expiración
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  CLEANING    │  execute() ejecutando cleanup
└──────┬───────┘
       │
       ├──┬─────────────────┐
       │  │                 │
       ▼  │                 ▼
┌──────────┐ │          ┌──────────────┐
│  ERROR   │ │          │   STANDBY    │
│ (1min    │ │          │ (no hay      │
│  retry)  │ │          │  expiraciones│
└────┬─────┘ │          └──────────────┘
     │        │
     └────┬───┘
           │
           ▼
    ┌──────────────┐
    │   SCHEDULING │  Volver a calcular
    └──────────────┘
```

### 3.8 Comparación: Este Scheduler vs Cron del Sistema

| Aspecto | Este Scheduler | Cron del Sistema |
|---------|----------------|------------------|
| **Dependencias** | Solo Node.js | Requiere SO |
| **Precisión** | Exacta al ms | Minutos (típicamente) |
| **Expiraciones lejanas** | Divide en ciclos | Ejecuta diario/hora |
| **Múltiples instancias** | Problema potencial | Cada instancia ejecuta |
| **Logs** | Centralizados en Winston | Syslog/del sistema |
| **Fallback** | Retry automático | Depende del SO |

### 3.9 Recomendaciones de Producción

1. **Para expiraciones de 1+ año:** El sistema funciona correctamente, pero considera:
   - Monitorear que el servidor no se reinicie frecuentemente (no afecta funcionalidad)
   - Cada reinicio = empieza de nuevo el ciclo (correcto)

2. **Para múltiples instancias (escalado horizontal):**
   - El sistema implementa **distributed locking** mediante MongoDB
   - Solo la instancia que adquiere el lock ejecuta el cleanup
   - Lock tiene timeout de 5 minutos (auto-expiración si instancia cae)
   - Ver sección 11 para detalles técnicos

3. **Para apagados prolongados:**
   - Al reiniciar, cleanup ejecuta inmediatamente
   - Borra archivos que expiraron mientras estaba apagado
   - Comportamiento correcto y esperado

4. **Comportamiento en modo Standby:**
   
   El sistema entra en **standby** cuando no hay expiraciones pendientes:
   
   ```
   getNextExpirationTimestamp() → null → "Sentinel in standby"
   ```
   
   **¿Qué pasa en standby?**
   - No hay timer activo
   - No se consume recursos
   - El sistema **espera eventos** para salir del standby
   
   **¿Cómo sale del standby?**
   
   | Evento | Acción |
   |--------|--------|
   | Nuevo archivo subido | Fin del ciclo recalcula próxima expiración |
   | Usuario accede a archivo | expirationChanged → schedule() |
   | Política de usuario actualizada | expirationChanged → schedule() |
   | Reinicio del servidor | Cleanup inmediato + schedule() |
   
   **Ejemplo de flujo standby:**
   
   ```
   Día 0: Todos los archivos expiraron, se borraron
          └─> No hay expiraciones pendientes
          └─> Standby mode (sin timer)
   
   Día 1: Usuario sube nuevo archivo (expira en 30 días)
          └─> expirationChanged event
          └─> schedule() → programa timer para día 31
   
   ... (Sistema activo hasta que todos los archivos expiren) ...
   
   Día 31: Último archivo expira y se borra
          └─> No hay expiraciones pendientes
          └─> Vuelve a Standby
   ```
   
   **Importante:** El scheduler **no permanece en standby para siempre**. Cualquier cambio en el sistema (nuevo archivo, acceso, cambio de política, reinicio) dispara `schedule()` que recalcula la próxima expiración.

### 3.10 Cálculo de Próxima Expiración

`getNextExpirationTimestamp()` hace dos consultas a MongoDB:

```javascript
// Consulta 1: Próxima expiración EXPLÍCITA
const nextExplicit = await File.findOne({
    expirationDate: { $gt: now }  // expirationDate mayor a ahora
}).sort({ expirationDate: 1 })    // El más cercano

// Consulta 2: Próxima expiración por POLÍTICA
const nextPolicy = await File.aggregate([
    { $match: { expirationDate: null } },  // Solo archivos sin fecha fija
    
    // Buscar la config del usuario
    { $lookup: {
        from: 'userstorages',
        localField: 'createdBy.user',
        foreignField: 'user',
        as: 'storage'
    }},
    
    // Calcular expireAt = lastAccess/createdAt + fileExpirationTime
    { $addFields: {
        expireAt: {
            $add: [
                { $cond: ['$storage.deleteByLastAccess', '$lastAccess', '$createdAt'] },
                { $multiply: ['$storage.fileExpirationTime', 24*60*60*1000] }
            ]
        }
    }},
    
    // Filtrar los que aún no expiraron
    { $match: { expireAt: { $gt: now } } }
]).sort({ expireAt: 1 })

// Retornar el más cercano de ambos
return min(nextExplicit?.expirationDate, nextPolicy?.expireAt)
```

#### Ejemplo Práctico

```
Archivos en el sistema:
  - archivo1.pdf: expirationDate = 2026-03-25 (explícita)
  - archivo2.png: expirationDate = null, lastAccess = 2026-03-15, 
                  fileExpirationTime = 10 días
                  → expireAt = 2026-03-15 + 10 días = 2026-03-25

nextExplicit = 2026-03-25
nextPolicy = 2026-03-25

Retorna: 2026-03-25

El scheduler espera hasta el 2026-03-25 y luego ejecuta cleanup.
```

### 3.4 El Cleanup en Acción

Cuando `executeCleanup()` se ejecuta:

```javascript
async executeCleanup() {
    const now = new Date()

    // ═══════════════════════════════════════════════════════════════
    // PASO 1: Archivos con fecha de expiración FIJA
    // ═══════════════════════════════════════════════════════════════
    
    const explicitFiles = await File.find({
        expirationDate: { 
            $ne: null,      // Que tenga fecha (no null)
            $lte: now       // Que la fecha sea menor o igual a ahora
        }
    })
    
    // Ejemplo: now = 2026-03-25 10:00
    // Archivos con expirationDate = 2026-03-25 09:59 → SE BORRAN
    // Archivos con expirationDate = 2026-03-25 10:01 → NO se borran
    // Archivos con expirationDate = null → NO se borran aquí
    
    if (explicitFiles.length > 0) {
        await this._parallelDelete(explicitFiles, ...)
    }

    // ═══════════════════════════════════════════════════════════════
    // PASO 2: Archivos por POLÍTICA del usuario
    // ═══════════════════════════════════════════════════════════════
    
    const policyFiles = await File.aggregate([
        { $match: { expirationDate: null } },  // Solo sin fecha fija
        
        // Unir con la config del usuario
        { $lookup: {
            from: 'userstorages',
            localField: 'createdBy.user',
            foreignField: 'user',
            as: 'storage'
        }},
        
        // Calcular: expireAt = lastAccess/createdAt + días
        { $addFields: {
            expireAt: {
                $add: [
                    { $cond: ['$storage.deleteByLastAccess', '$lastAccess', '$createdAt'] },
                    { $multiply: ['$storage.fileExpirationTime', 24*60*60*1000] }
                ]
            }
        }},
        
        // Filtrar: expireAt <= now (ya expiró)
        { $match: { expireAt: { $lte: now } } }
    ])
    
    if (policyFiles.length > 0) {
        await this._parallelDelete(policyFiles, ...)
    }
}
```

#### Ejemplo Completo

```
Usuario admin tiene:
  fileExpirationTime = 1 día
  deleteByLastAccess = true

Archivo: foto.png
  createdAt: 2026-03-19 10:00
  lastAccess: 2026-03-19 10:00
  expirationDate: null

El sistema calcula:
  expireAt = lastAccess + fileExpirationTime
           = 2026-03-19 10:00 + 1 día
           = 2026-03-20 10:00

En cleanup (ahora = 2026-03-20 10:00:01):
  expireAt (2026-03-20 10:00) <= ahora (2026-03-20 10:00:01) → SÍ, expiró
  → Se marca para borrar
```

---

## 4. La Eliminación Real del Archivo

### 4.1 ¿Qué significa `_robustDelete`?

"Robust" significa que puede manejar errores sin romperse. Si el archivo ya no existe en disco, no falla. Si ya fue eliminado de la DB, no intenta eliminarlo de nuevo.

```javascript
async _robustDelete(file, action, description) {
    
    // 1. Limpiar caché
    // Si alguien tiene el archivo "en memoria", sacarlo
    cache.delete(file.relativePath)

    // 2. ¿Ya fue eliminado?
    const existingFile = await File.findOne({ _id: file._id })
    if (!existingFile) {
        return true  // Ya no existe, está bien
    }

    // 3. Eliminar archivo del DISCO
    try {
        await fs.unlink(file.relativePath)
    } catch (err) {
        // Si el archivo no existe en disco (ENOENT), está bien
        // Si hay otro error (permisos, disco lleno), lanzar error
        if (err.code !== 'ENOENT') throw err
    }

    // 4. Eliminar registro de MongoDB
    await File.deleteOne({ _id: file._id })

    // 5. Actualizar espacio del usuario
    // Si el archivo pesaba 5MB, el usuario tiene 5MB menos usados
    await updateUserUsedStorage(creatorId, -file.size)

    // 6. Registrar qué pasó (auditoría)
    await createAudit(action, description, ...)

    return true
}
```

### 4.2 Eliminación en Paralelo

Si hay 1000 archivos para borrar, no los borra uno por uno. Los divide en grupos:

```javascript
// Configurable via MEDIA_CLEANUP_CONCURRENCY (default: 20)
const CLEANUP_CONCURRENCY = 20

async _parallelDelete(files) {
    // Dividir en chunks de 20
    const chunks = [
        [archivo1, archivo2, ..., archivo20],
        [archivo21, archivo22, ..., archivo40],
        // ...
    ]
    
    for (const chunk of chunks) {
        // Dentro de cada chunk, borrar en paralelo
        const promises = chunk.map(file => this._robustDelete(file))
        await Promise.all(promises)
    }
}
```

**¿Por qué en paralelo?**

Porque borrar 1000 archivos uno por uno tarda horas. En paralelo (20 a la vez) es mucho más rápido.

---

## 5. Eventos: Cómo el Sistema Se Entera de Cambios

### 5.1 El Patrón EventEmitter

El scheduler "escucha" eventos. Cuando algo importante pasa, el sistema emite un evento:

```
┌──────────────┐              ┌──────────────────┐
│   Emisor     │ ──────────→ │    Receptor      │
│  (Service)   │   evento    │  (Scheduler)     │
└──────────────┘              └──────────────────┘
```

#### Ejemplo de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│ UserStorageService.updateUserStorage()                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FileService.emit('expirationChanged')                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ "¡Cambió una política!"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ CleanupScheduler.on('expirationChanged') {                       │
│     this.schedule()  // Recalcula la próxima expiración         │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 ¿Cuándo se emite `expirationChanged`?

Se emite en **DOS situaciones**:

#### 1. Cambio de política del usuario

```javascript
// En UserStorageService.updateUserStorage()
export const updateUserStorage = async function(..., fileExpirationTime, ...) {
    
    // Actualiza la configuración
    await userStorage.findOneAndUpdate({ _id: id }, {...})
    
    // AVISO: "La política cambió, recalculen la próxima expiración"
    FileService.emit('expirationChanged')
    
    return result
}
```

#### 2. Acceso a archivo próximo a expirar ( PRINCIPIO DE COHERENCIA )

Este es el caso más importante para mantener la **coherencia del sistema**:

```
Si la descarga cuenta como acceso, entonces el sistema debe determinar 
si debe borrarse en función de ese nuevo acceso.
```

```javascript
// En FileService.updateByRelativePath()
async updateByRelativePath(relativePath) {
    
    // 1. Obtener archivo actual
    const file = await File.findOne({ relativePath })
    
    // 2. ¿Estaba próximo a expirar?
    const wasNearExpiration = await this._isNearExpiration(file)
    
    // 3. Actualizar lastAccess (el archivo se "renueva")
    const updatedFile = await File.findOneAndUpdate(...)
    
    // 4. Si estaba próximo a expirar, notificar al scheduler
    //    para que recalcule y NO lo borre prematuramente
    if (wasNearExpiration) {
        this.emit('expirationChanged')
    }
    
    return updatedFile
}
```

La función `_isNearExpiration()` verifica si el archivo expira dentro del threshold configurado:

```javascript
async _isNearExpiration(file) {
    const userStorage = await userStorage.findOne({ user: file.createdBy.user })
    
    const expireAt = file.lastAccess + userStorage.fileExpirationTime * días
    
    // Se considera "próximo" si expira dentro del threshold
    return expireAt <= now + NEAR_EXPIRATION_THRESHOLD_MS
}
```

### 5.3 Tabla Resumida de Eventos

| Acción | ¿Se emite evento? | Razón |
|--------|-------------------|-------|
| Cambio de política del usuario | ✅ Sí | El scheduler debe reagendar |
| Acceso a archivo próximo a expirar | ✅ Sí | Coherencia: el acceso renueva el archivo |
| Acceso a archivo NO próximo a expirar | ❌ No | Optimización: no afecta la cola de expiración |
| Subir nuevo archivo | ❌ No | El scheduler recalcula al final del ciclo |
| Modificar `lastAccess` manualmente | ❌ No | No hay "acceso real" del usuario |
| Cambiar `expirationDate` explícita | ❌ No | No es un acceso del usuario |

### 5.4 Principio de Coherencia Explicado

```
ESCENARIO SIN COHERENCIA (PROBLEMA):
─────────────────────────────────────
1. Archivo tiene lastAccess = hace 29 días
2. fileExpirationTime = 30 días
3. expireAt = ahora + 1 día

4. Usuario descarga el archivo (lastAccess = ahora)
5. expireAt = ahora + 30 días (¡se renovó!)

6. PERO el scheduler no se entera...
7. Cleanup ejecuta mañana y BORRA el archivo ❌

ESCENARIO CON COHERENCIA (CORRECTO):
─────────────────────────────────────
1. Archivo tiene lastAccess = hace 29 días
2. fileExpirationTime = 30 días
3. expireAt = ahora + 1 día (dentro del threshold)

4. Usuario descarga el archivo
5. Sistema detecta: "estaba próximo a expirar"
6. Sistema emite expirationChanged
7. Scheduler recalcula: expireAt = ahora + 30 días
8. Cleanup tomorrow: archivo NO se borra ✅
```

---

## 6. Variables de Entorno

### 6.1 Lista Completa

| Variable | Default | Descripción |
|----------|---------|-------------|
| `MEDIA_FILE_EXPIRATION_TIME_IN_DAYS` | `365` | Días de expiración para nuevos usuarios |
| `MEDIA_FILE_CLEANUP_ENABLED` | `true` | Activa/desactiva el cleanup automático |
| `MEDIA_CLEANUP_CONCURRENCY` | `20` | Archivos a borrar en paralelo |
| `MEDIA_ROOT_DIR` | `process.cwd()` | Directorio base para escanear archivos |
| `MEDIA_NEAR_EXPIRATION_THRESHOLD_MS` | `43200000` (12 horas) | Threshold para considerar un archivo "próximo a expirar" |

### 6.2 Ejemplos de Uso

```bash
# Expiración de 1 año (default)
MEDIA_FILE_EXPIRATION_TIME_IN_DAYS=365 npm run back

# Expiración agresiva (pruebas)
MEDIA_FILE_EXPIRATION_TIME_IN_DAYS=1 npm run back

# Desactivar cleanup automático
MEDIA_FILE_CLEANUP_ENABLED=false npm run back

# Threshold de 6 horas (archivos a punto de expirar se notifican antes)
MEDIA_NEAR_EXPIRATION_THRESHOLD_MS=21600000 npm run back
```

# Más velocidad de cleanup (50 archivos en paralelo)
MEDIA_CLEANUP_CONCURRENCY=50 npm run back
```

---

## 7. Guía para Probar el Sistema

### 7.1 Escenario: Quiero que al subir un archivo, se borre en 1 día

#### Paso 1: Configurar el usuario

```graphql
mutation {
    userStorageUpdate(
        id: "USER_STORAGE_ID"
        input: {
            fileExpirationTime: 1
            deleteByLastAccess: true
        }
    ) {
        id
        fileExpirationTime
        deleteByLastAccess
    }
}
```

#### Paso 2: Subir un archivo

Sube cualquier archivo normalmente. Verás que en MongoDB tiene:

```javascript
{
    expirationDate: null,
    lastAccess: Date.now()
}
```

#### Paso 3: Verificar que expirará en 1 día

En MongoDB shell:

```javascript
db.files.findOne({ filename: "tu-archivo" })

// lastAccess = 2026-03-19T12:00:00Z
// expireAt sería = 2026-03-20T12:00:00Z
```

#### Paso 4: Simular que pasó 1 día

Hay dos formas:

**Opción A: Modificar lastAccess directamente**

```javascript
// Mover lastAccess a hace 2 días
// Así expireAt = hace 2 días + 1 día = ayer → YA EXPIÓ
db.files.updateOne(
    { _id: ObjectId("...") },
    { $set: { lastAccess: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } }
)
```

**Opción B: Reiniciar el servidor**

El scheduler recalcula con los valores actuales. Si modificaste `lastAccess` **ANTES** de reiniciar, el scheduler verá que hay archivos para borrar.

#### Paso 5: Verificar que se borró

```javascript
// Buscar el archivo
db.files.findOne({ _id: ObjectId("...") })
// Si retorna null → fue eliminado

// Verificar el log del backend
// Deberías ver:
// "FileService.executeCleanup: found X files expired by policy"
```

### 7.2 Escenario: Quiero probar expiración por fecha explícita

#### Paso 1: Subir archivo con fecha

```graphql
mutation {
    fileCreate(
        input: {
            file: # archivo
            expirationDate: "2026-03-20T00:00:00Z"  # Fecha específica
        }
    ) {
        id
        expirationDate
    }
}
```

#### Paso 2: Simular que llegó la fecha

```javascript
// Poner la fecha en el pasado
db.files.updateOne(
    { _id: ObjectId("...") },
    { $set: { expirationDate: new Date(Date.now() - 1000) } }
)
```

#### Paso 3: Esperar al cleanup

El scheduler lo borrará en el próximo ciclo.

---

## 8. Troubleshooting

### 8.1 El archivo no se borra aunque debería

#### Verificación 1: ¿El archivo tiene UserStorage?

```javascript
// Buscar la config del usuario
db.userstorages.findOne({ user: ObjectId("USER_ID") })

// Si retorna null, el usuario no tiene política
// Los archivos de este usuario NUNCA se borrarán por política
```

#### Verificación 2: ¿Qué política tiene?

```javascript
db.userstorages.findOne({ user: ObjectId("USER_ID") })
// {
//   fileExpirationTime: ???,
//   deleteByLastAccess: ???,
//   deleteByCreatedAt: ???
// }
```

#### Verificación 3: Calcular expireAt manualmente

```javascript
// Archivo
const file = db.files.findOne({ _id: ObjectId("...") })
// file.lastAccess = ???
// file.createdAt = ???

// UserStorage
const storage = db.userstorages.findOne({ user: file.createdBy.user })
// storage.fileExpirationTime = ???
// storage.deleteByLastAccess = ???

// Si deleteByLastAccess = true
// expireAt = lastAccess + fileExpirationTime
// Si deleteByLastAccess = false
// expireAt = createdAt + fileExpirationTime

// Comparar: expireAt vs now
```

#### Verificación 4: ¿El scheduler está corriendo?

Ver logs:

```
CleanupScheduler: Constructor started
CleanupJob: Next expiration: 2026-03-20T12:00:00Z
CleanupJob: Next cleanup scheduled in 1234 minutes
```

Si ves "Cleanup is disabled", el scheduler no hace nada.

### 8.2 Cambié la política pero no pasa nada

El scheduler recalcula SOLO cuando:

1. Iniciaste/reiniciaste el servidor
2. Modificaste la política (emit `expirationChanged`)

**Solución**: Reiniciar el servidor.

### 8.3 Tengo archivos de otro proyecto/directorio

Los archivos pueden tener `absolutePath` pointing a otra ubicación. El sistema ahora:

1. Escanear el directorio actual
2. Verificar si el archivo existe en su `absolutePath` guardado
3. Si existe en `absolutePath` aunque no esté en el scan, NO lo marca como huérfano

---

## 9. Arquitectura Detallada

### 9.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND / API                              │
│                                                                 │
│   mutation userStorageUpdate(...)                               │
│   mutation fileCreate(...)                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GRAPHQL RESOLVERS                            │
│                                                                 │
│   UserStorageResolver.js  ───→  Actualiza política              │
│   FileResolver.js         ───→  Crea/gestiona archivos        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICES                                     │
│                                                                 │
│   UserStorageService.js                                         │
│   ├─ updateUserStorage()  ────→  emit('expirationChanged')     │
│   └─ createUserStorage()                                       │
│                                                                 │
│   FileService.js                                                │
│   ├─ executeCleanup()      ────→  Elimina archivos              │
│   ├─ _robustDelete()       ────→  Elimina archivo específico    │
│   └─ getNextExpiration...()─────→  Calcula próxima expiración  │
│                                                                 │
│   FileCleanupJob.js                                             │
│   ├─ CleanupScheduler                                          │
│   │   └─ schedule()  ────→  Programa setTimeout                │
│   │       execute()  ────→  Ejecuta cleanup                    │
│   │       on('expirationChanged') ────→  Recalcula            │
│   └─ startFileCleanupJob()                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MONGODB                                     │
│                                                                 │
│   ┌─────────────┐         ┌─────────────┐                      │
│   │    files    │         │ userstorages│                      │
│   ├─────────────┤         ├─────────────┤                      │
│   │ _id         │         │ _id         │                      │
│   │ lastAccess  │◄────────│ user        │                      │
│   │ createdAt   │         │ fileExpTime │                      │
│   │ expDate     │         │ delByLastAc │                      │
│   │ createdBy   │         └─────────────┘                      │
│   └─────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Flujo de Datos Completo

#### 1. Usuario configura política

```
GraphQL: userStorageUpdate(id, {fileExpirationTime: 1})
    │
    └─→ UserStorageService.updateUserStorage()
        │
        └─→ MongoDB: userstorages.update(...)
            │
            └─→ FileService.emit('expirationChanged')
                │
                └─→ CleanupScheduler.schedule()
                    │
                    └─→ getNextExpirationTimestamp()
                        │
                        └─→ setTimeout(execute, delay)
```

#### 2. Usuario sube archivo

```
GraphQL: fileCreate(file)
    │
    └─→ FileService.upload()
        │
        └─→ MongoDB: files.insert({
            filename: "...",
            lastAccess: Date.now(),
            createdAt: Date.now(),
            expirationDate: null,
            createdBy.user: USER_ID
        })
```

#### 3. Scheduler ejecuta cleanup

```
executeCleanup()
    │
    ├─→ MongoDB: files.find({expirationDate: {$lte: now}})
    │   │
    │   └─→ _parallelDelete(explicitFiles)
    │
    └─→ MongoDB: files.aggregate([...])
        │
        └─→ _parallelDelete(policyFiles)

_robustDelete(file)
    │
    ├─→ fs.unlink(file.relativePath)  // Elimina del disco
    ├─→ files.deleteOne(...)            // Elimina de DB
    ├─→ userstorages.update(usedSpace) // Actualiza espacio
    └─→ createAudit(...)               // Registra acción
```

---

## 10. Índices de MongoDB

Los índices aceleran las consultas. Sin índices, MongoDB leería TODOS los archivos para encontrar los expirados.

```javascript
// FileModel.js

// Índice para buscar por fecha de expiración explícita
FileSchema.index({ expirationDate: 1, createdAt: 1 })

// Índice para buscar archivos de un usuario
FileSchema.index({ "createdBy.user": 1, expirationDate: 1 })

// Índices para políticas
FileSchema.index({ lastAccess: 1 })    // Para deleteByLastAccess
FileSchema.index({ createdAt: 1 })     // Para deleteByCreatedAt

// Índice para paths (útiles para usedSpace)
FileSchema.index({ relativePath: 1 })
```

**¿Por qué múltiples índices en `expirationDate`?**

Porque hay dos tipos de búsqueda:

1. `expirationDate <= now` (fecha explícita)
2. `expirationDate = null` + calcular `expireAt` (política)

---

## Archivos Involucrados

| Archivo | Responsabilidad |
|---------|-----------------|
| `FileCleanupJob.js` | Scheduler - programa y ejecuta cleanup |
| `FileService.js` | Lógica principal - executeCleanup, _robustDelete |
| `UserStorageService.js` | Gestión de políticas de usuario |
| `FileModel.js` | Schema de archivos + índices |
| `UserStorageModel.js` | Schema de configuración de usuario |
| `FileResolver.js` | API GraphQL |
| `UserStorageResolver.js` | API GraphQL para políticas |
| `DistributedLock.js` | Sistema de lock distribuido para múltiples instancias |

---

## 11. Sistema de Lock Distribuido

### 11.1 ¿Por qué es necesario?

Cuando tienes múltiples instancias de Docker ejecutándose (escalado horizontal), cada instancia tiene su propio scheduler. Sin lock distribuido:

```
Instancia A: cleanup ejecutado 14:00:00
Instancia B: cleanup ejecutado 14:00:00
Instancia C: cleanup ejecutado 14:00:00

Resultado: Mismo archivo podría intentar borrarse 3 veces
```

### 11.2 ¿Cómo funciona?

El sistema usa MongoDB como backend de lock:

```javascript
// Colección: cleanup_locks
{
    _id: "cleanup_lock",
    instanceId: "docker-container-abc123",
    acquiredAt: 1742390400000  // Timestamp cuando se adquirió (2026-03-19 00:00:00 UTC)
}
```

#### Algoritmo de Adquisición

```javascript
// 1. Intentar adquirir lock con operación atómica
await collection.updateOne(
    {
        _id: lockId,
        $or: [
            { instanceId: myInstanceId },           // Yo ya tengo el lock
            { acquiredAt: { $lt: now - TIMEOUT } } // Lock expiró
        ]
    },
    {
        $set: {
            instanceId: myInstanceId,
            acquiredAt: now
        }
    },
    { upsert: true }
)

// 2. Verificar que realmente lo conseguimos
const lock = await collection.findOne({ _id: lockId })
return lock.instanceId === myInstanceId
```

### 11.3 Características del Lock

| Característica | Valor | Descripción |
|----------------|-------|-------------|
| **Timeout** | 5 minutos | Si una instancia cae, el lock expira |
| **Auto-expiración** | Sí | Nunca hay lock "colgado" |
| **Operación atómica** | Sí | Usa MongoDB para prevenir race conditions |
| **Re-adquisición** | Sí | Misma instancia puede "renovar" su lock |

### 11.4 Flujo de Cleanup con Lock

```
┌─────────────────────────────────────────────────────────────────┐
│ CleanupJob.execute()                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. ¿Puedo adquirir lock?                                         │
│    DistributedLock.acquireLock('cleanup')                         │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
     ┌───────────────┐              ┌───────────────┐
     │    SÍ (true)  │              │   NO (false)  │
     └───────┬───────┘              └───────┬───────┘
             │                               │
             ▼                               ▼
     ┌───────────────┐              ┌───────────────┐
     │ Ejecutar      │              │ Log: "Lock    │
     │ cleanup       │              │ held by X,    │
     │               │              │ skipping"      │
     └───────┬───────┘              └───────────────┘
             │                               │
             ▼                               │
     ┌───────────────┐                      │
     │ Liberar lock   │                      │
     │ releaseLock()  │                      │
     └───────────────┘                      │
```
