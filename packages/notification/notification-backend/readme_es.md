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

## Tabla de contenidos

- [Queries y Mutations](##Queries y Mutations)
  - Types
    - Notification
    - NotificationsPaginated
  - Queries
    - fetchNotifications
    - notificationsPaginateFilter
  - Mutations
    - createNotification
    - markAsReadOrNotRead
    - markAllReadOrNotRead
  - Subscription
    - notification
- Servicios disponibles
    - createNotificationService
    - fetchNotificationsService
    - notificationsPaginateFilterService
    - markAsReadOrNotReadService
    - markAllReadOrNotReadService
    - deleteNotificationsService

##Queries y Mutations

### Types

**Type NotificationsPaginated**

```graphql endpoint
type NotificationsPaginated{
  totalItems: Int
  page: Int
  items: [Notification]
}
```

Nombre  | Tipo de dato | Descripcion |
------- | -------------| --------------|
totalItems  | Integer | --|
page  | Integer | --|
items | Array of Notification type    | -- |


**Type Notification**

```graphql endpoint
type Notification{
  id: ID
  user: ID
  title: String
  content: String
  read: Boolean
  creationDate: String
  type: String
  icon: String
  readDate: String
}
```

Nombre  | Tipo de dato | Descripcion |
------- | -------------| --------------|
id  | ID | --|
user  | ID| --|
title | String    | -- |
content | String    | -- |
read | Boolean    | -- |
creationDate | String    | -- |
type | String    | -- |
icon | String    | -- |
readDate | String    | -- |

--- 
### Queries

#### fetchNotifications

**Definición y uso**

_Obtiene las notificaciones de un determinado usuario.
Delega la tarea al servicio fetchNotificationsService. Retorna una promesa._

**Sintaxis**
```graphql endpoint

query: {
        fetchNotifications( limit: Int, 
                            isRead: Boolean,
                            type: String):[Notification]
}

type Notification{
            id: ID,
            user: ID,
            title: String
            content: String
            read: Boolean
            creationDate: String
            type: String
            icon: String
            readDate: String
    }
```

**Parametros**

Nombre  | Tipo de dato | Requerido | Descripcion |
------- | -------------|--------| --------------|
limit  | Integer | No | Representa el numero de notificaciones limite que desea obtener. Por defecto obtiene todas las notificaciones del usuario.|
isRead  | Boolean| Si| 'true' si quiere obtener las notificaciones que ya fueron leidas. 'false' si quiere obtener solo las notificaciones no leidas. 'null' en caso de que desee obtener todas las notificaciones sin importar en estado de la misma.|
type | String    | No | Sólo en caso de que desee filtrar las notificaciones por tipo. |

**Datos que retorna el servicio**

Retorna un Array del type Notification. Para más información vaya a la sección Types

---

#### notificationsPaginateFilter

**Definición y uso**

_Obtiene las notificaciones paginadas de un determinado usuario.
Delega la tarea al servicio notificationsPaginateFilterService. Retorna una promesa._

**Sintaxis**
```graphql endpoint
query: {
        notificationsPaginateFilter(
                                    limit: Int, 
                                    pageNumber: Int, 
                                    isRead: Boolean, 
                                    type: String): NotificationsPaginated
}

type NotificationsPaginated{
                        totalItems: Int
                        page: Int
                        items: [Notification]
}

type Notification{
                    id: ID,
                    user: ID,
                    title: String
                    content: String
                    read: Boolean
                    creationDate: String
                    type: String
                    icon: String
                    readDate: String
}
```

**Parametros**

Nombre  | Tipo de dato | Requerido | Descripcion |
------- | -------------|--------| --------------|
limit  | Integer | No | Representa el numero de notificaciones limite que desea obtener. Por defecto obtiene todas las notificaciones del usuario.|
isRead  | Boolean| Si| 'true' si quiere obtener las notificaciones que ya fueron leidas. 'false' si quiere obtener solo las notificaciones no leidas. 'null' en caso de que desee obtener todas las notificaciones sin importar en estado de la misma.|
type | String    | No | Sólo en caso de que desee filtrar las notificaciones por tipo. |

**Datos que retorna el servicio**

Retorna un Array del type Notification. Para más información vaya a la sección types.

---
### Mutations 


#### createNotification

**Definición y uso**

_Crea una notificación.
Delega la tarea al servicio createNotificationService. Retorna una promesa._

**Sintaxis**
```graphql endpoint

mutation: {
                createNotification(
                                    title: String, 
                                    content: String, 
                                    type: String, 
                                    icon: String):Notification
}

type Notification{
            id: ID,
            user: ID,
            title: String
            content: String
            read: Boolean
            creationDate: String
            type: String
            icon: String
            readDate: String
    }
```
**Parametros**

Nombre  | Tipo de dato | Requerido | Descripcion |
------- | -------------|--------| --------------|
title  | String | Si | Será usado como el título de la notificación.|
content  | String| Si| Será usado como el contenido de la notificación.|
type | String | Si | Será usado como la categoría de la notificación. |
icon | String | Si | Será usado como el icono que represente la notificación.|
**Datos que retorna el servicio**

Retorna los datos de la notificación creada. Para más información vaya a la sección Types

---
 
### markAllReadOrNotRead

**Definición y uso**

_Permite marcar todas las notificaciones de usuario como leídas o no leídas.
Delega la tarea al servicio markAllReadOrNotReadService. Retorna una promesa._

**Sintaxis**
```graphql endpoint

mutation: {
            markAllReadOrNotRead(
                                isRead: Boolean):ResponseNotification
}

type ResponseNotification{

}

```

**Parametros**

Nombre  | Tipo de dato | Requerido | Descripcion |
------- | -------------|--------| --------------|
idUserAuth  | ID | Si | El ID del usuario a quien todas las notificaciones se marcarán como leídas o no leídas.|
readValue  | Boolean| Si| 'true' para marcar todas las notificaciones como leídas. 'false' para marcar todas las notificaciones como no leídas.|

**Datos que retorna el servicio**

Retorna los datos de la notificación modificada. Para más información vaya a la sección Types

---

### Subscription

#### notification 


**Definición y uso**

_Permite subscribirte a las notificaciones por websocket.
Delega la tarea al servicio fetchNotificationsService. Retorna una promesa._

**Sintaxis**
```graphql endpoint
Subscription: {
                notification(user: ID!): Notification
}


type Notification{

}
```

**Parametros**

Nombre  | Tipo de dato | Requerido | Descripcion |
------- | -------------|--------| --------------|
user  | ID | Si | El ID del usuario el cual serán "escuchadas" sus notificaciones.|

---

## Servicios disponibles

Los servicios son metodos o funciones que realizan las operaciones de alta, baja y modificacion de notificaciones. Tanto las queries como las mutations 
delegan sus responsabilidades a estos servicios.
Si no desea usar las queries y mutations definidas, puede utilizar los servicios de forma independiente.

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
