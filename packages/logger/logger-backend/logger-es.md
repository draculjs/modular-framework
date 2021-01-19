# Módulo Logger

El Módulo Dracul Logger proporciona una serie de loggers de Winston pre armados, listos para usar.
Se pueden configurar las opciones desde las variables de entorno.

## Este módulo permite:

1. 1) Diferenciar los logs decidiendo el nivel de prioridad.
2. 2) Los niveles para registrar los logs de mayor a menor prioridad son:
  - - -Emergencias (energ)
  - - -Alerta (alert)
  - - -Critico (crit)
  - - -Error (error) 
  - - -Warning (warning)
  - - -Noticia (notice)
  - - -Info (info)
  - - -Debug (debug)
3. 3) Permite definir el formato de salida del log mediante el transportador desde las variables de entorno.

## Instalación:
```
npm i @dracul/logger-backend
```
## Configuración de las variables de entorno:
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
<table>
  <tr>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <th>Nivel del log</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_LEVEL</td>
    <td>String</td>
    <td>Según el nivel del Log que se desee se lo declara como error / warning / info / debug.</td>
  </tr>
  <tr>
    <th>Request</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_REQUEST</td>
    <td>String [ON/OFF]</td>
    <td></td>
  </tr>
  <tr>
    <td>LOG_RESPONSE_TIME</td>
    <td>String [ON/OFF]</td>
    <td></td>
  </tr>
  <tr>
    <td>LOG_GQL_ERRORS</td>
    <td>String [ON/OFF]</td>
    <td></td>
  </tr>
  <tr>
    <th>Transportador de Log</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_CONSOLE</td>
    <td>String [ON/OFF]</td>
    <td>Habilita el registro por consola.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_COMBINED</td>
    <td>String [ON/OFF]</td>
    <td>Habilita el registro por consola y por archivo, además, trae los logs de todos los niveles.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_ERROR</td>
    <td>String [ON/OFF]</td>
    <td>Habilita el registro de errores.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_ACCESS</td>
    <td>String [ON/OFF]</td>
    <td>Habilita el registro de las peticiones al backend.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_GQL_ERROR</td>
    <td>String [ON/OFF]</td>
    <td>Habilita el registro de las respuestas del backend y, además, la demora en responder en milisegundos.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_GQL_RESPONSE</td>
    <td>String [ON/OFF]</td>
    <td>Habilita el registro de los errores de GraphQl.</td>
  </tr>
  <tr>
    <th>Colorear</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_COLORIZE</td>
    <td>String [ON/OFF]</td>
    <td>Habilita el color de los Logs según su tipo.</td>
  </tr>
  <tr>
    <th>Tamaño máximo del archivo en bytes</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_FILE_MAX_SIZE</td>
    <td>Integer</td>
    <td>Declara el tamaño del archivo en el que se guardan los logs en Bytes. Ej: 10000000 Bytes == 1 MegaByte.</td>
  <tr>
    <th>Número máximo de archivos</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_FILE_MAX_FILES</td>
    <td>Integer</td>
    <td>Declara la cantidad máxima de archivos para registrar los Logs.</td>
  </tr>
  <tr>
    <th>Modo del log</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_FILE_MAX_SIZE</td>
    <td>String [TEXT/JSON]</td>
    <td>Declara de que forma se desea guardar los logs. Como texto o como JSON.</td>
  </tr>
</table>

## Recomendación
Se recomienda utilizar Scaffold, donde ya contiene todos los módulos implementados para poder usarlo como base de proyecto.
https://github.com/draculjs/scaffold
