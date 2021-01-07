[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul módulo de notificaciones

Este módulo le permite crear y administrar notificaciones personalizables para cualquier acción de su proyecto.

## Este módulo permite:

- Crear notificaciones.
- Marcar las notificaciones como leidas o no leidas.
- Filtrar notificaciones por tipo, fecha de recibida o fecha de leida.
- Obtener un listado de notificaciones de forma paginada.
- Eliminar notificaciones en base a su fecha de creación.

## Instalación:

```
npm i @dracul/notification-backend
```

## Ejemplos de uso:

_Un ejemplo usando el método **createNotificationService**._

```js
import {createNotificationService} from "@dracul/notification-backend"

let userId = "123" //some userId
let title = "Notification Title"
let content = "Notification content"
let type = "SomeType"
let icon =  "SomeIcon"

createNotificationService(
    userId,
    title,
    content,
    type,
    icon
)
.then(notificationDocument => {
    console.log("Notification created: ",notificationDocument)
})
.catch(error => {
    console.error(error)
})
```

## Métodos disponibles

### createNotificationService

**Definición y uso**

_Crea una notificación.
Retorna una promesa._

**Sintaxis**
```js
createNotificationService(userId, title, content, type, icon)
```

**Parametros**

- **userId**: requerido. Tipo de dato ObjectID. El identificador del usuario al cual se le creará la notificación.

- **title**: requerido. Tipo de dato String. Será usado como el título de la notificación.

- **content**: requerido. Tipo de dato String. Será usado como el contenido de la notificación.

- **type**: requerido. Tipo de dato String. Será usado como la categoría de la notificación.

- **icon**: requerido. Tipo de dato String. Será usado como el icono que represente la notificación.

---

### fetchNotificationsService

**Definición y uso**

_Obtiene las notificaciones de un determinado usuario.
Retorna una promesa._

**Sintaxis**
```js
fetchNotificationsService(userId, limit, isRead, type)
```

**Parametros**

- **userId**: requerido. Tipo de dato ObjectID. El identificador del usuario que será usado para obtener sus notificaciones.
- **limit**: no requerido. Tipo de dato Integer. Representa el numero de notificaciones limite que desea obtener. Por defecto obtiene todas las notificaciones del usuario.
- **isRead**: requerido. Tipo de dato Boolean. 'true' si quiere obtener las notificaciones que ya fueron leidas. 'false' si quiere obtener solo las notificaciones no leidas. 'null' en caso de que desee obtener todas las notificaciones sin importar en estado de la misma.
- **type**: no requerido. Tipo de dato String. Sólo en caso de que desee filtrar las notificaciones por tipo.

---

### notificationsPaginateFilterService

**Definición y uso**

_Obtiene las notificaciones paginadas de un determinado usuario.
Retorna una promesa._

**Sintaxis**
```js
notificationsPaginateFilterService(userId, limit, pageNumber, isRead, type)
```

**Parametros**

- **userId**: Requerido. Tipo de dato ObjectID. El identificador del usuario que será usado para obtener sus notificaciones.
- **limit**: No requerido. Tipo de dato Integer. Representa el numero de notificaciones limite que desea obtener. Por defecto obtiene todas las notificaciones del usuario.
- **pageNumber**: No requerido. Tipo de dato Integer. (Úselo para la paginación de notificaciones), el número de página que desea obtener. por defecto devuelve la página 1.
- **isRead**: Requerido. Tipo de dato Boolean. 'true' si quiere obtener las notificaciones que ya fueron leidas. 'false' si quiere obtener solo las notificaciones no leidas. 'null' en caso de que desee obtener todas las notificaciones sin importar en estado de la misma.
- **type**: Requerido. Tipo de dato String. Sólo en caso de que desee filtrar las notificaciones por tipo.

---

### markAsReadOrNotReadService

**Definición y uso**

_Permite marcar una notificación como leída o no leída.
Retorna una promesa._


**Sintaxis**
```js
markAsReadOrNotReadService(idNotification, readValue)
```

**Parametros**

- **idNotification**: Requerido. Tipo de dato ObjectID. El identificador de la notificacion que se marcará como leida/no leida.
- **readValue**: Requerido. Tipo de dato Boolean. "true" para marcar la notificación como leída. 'false' para marcar la notificación como no leída.

---

### markAllReadOrNotReadService

**Definición y uso**

_Permite marcar todas las notificaciones de usuario como leídas o no leídas.
Retorna una promesa._

**Sintaxis**
```js
markAllReadOrNotReadService(idUserAuth, readValue)
```

**Parametros**

- **idUserAuth**: requerido. Tipo de dato ObjectID. El ID del usuario a quien todas las notificaciones se marcarán como leídas o no leídas.
- **readValue**: requerido. Tipo de dato Boolean. 'true' para marcar todas las notificaciones como leídas. 'false' para marcar todas las notificaciones como no leídas.

---

### deleteNotificationsService

**Definición y uso**

_Elimina las notificaciones de un determinado usuario.
Retorna una promesa._

**Sintaxis**
```js
deleteNotificationsService(userId, numberOfDays)
```

**Parametros**

- **userId**: requerido. Tipo de dato ObjectID. El identificador del usuario cuyas notificaciones seran eliminadas.
- **numberOfDays**: no requerido. Tipo de dato Integer. La cantidad de días que debe tener una notificación para poder eliminarla. De forma predeterminada, elimina las notificaciones de 30 días o más.


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
