## EN - Dracul notification module frontend environment variables 

### This module requires the configuration of the following environment variables:

|Name  |Type | Description |
|----------|----------|------|
|`VUE_APP_ACTIVATE_WEB_SOCKET`   |Boolean  |'true' if you want to activate notifications by websocket, 'false' if you want to activate them by polling  |                                   
|`VUE_APP_TIME_POLLING`  |Integer   |The time in milliseconds it waits to request the notifications again (In case the notifications by polling are activated)|  

### Use example

```
VUE_APP_TIME_POLLING = 30000

VUE_APP_ACTIVATE_WEB_SOCKET = true
```

---

## ES - Dracul módulo de notificaciones frontend, variables de entorno.

### Este modulo requiere de la configuracion de las siguientes variables de entorno:

|Nombre  | Tipo | Descripción |
|----------|----------|-----|
|`VUE_APP_ACTIVATE_WEB_SOCKET`   |Boolean  | 'true' si desea activar notificaciones por websocket, 'false' si desea activarlas por sondeo  |                                   
|`VUE_APP_TIME_POLLING`  |Integer   |El tiempo en milisegundos que espera para volver a solicitar las notificaciones (En el caso de que esten activadas las notificaciones por polling)| 

### Ejemplo de uso

```
VUE_APP_TIME_POLLING = 30000

VUE_APP_ACTIVATE_WEB_SOCKET = true
```
