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

<div class="toc">
  <ul>
    <li><a href="#queries-and-mutations">GraphQL: queries y mutations</a></li>
      <ul>
        <li><a href="#types">Types</a>
            <ul>
                <li> <a href="#notification">Notification</a></li>
                <li> <a href="#notifications-paginated">NotificationsPaginated</a></li>
                <li> <a href="#response-notification">ResponseNotification</a></li>
            </ul>
        </li>
        <li><a href="#queries">Queries</a>
            <ul>
                <li> <a href="#fetch-notifications">fetchNotifications</a></li>
                <li> <a href="#notifications-paginate-filter">notificationsPaginateFilter</a></li>
            </ul>
        </li>
        <li><a href="#mutations">Mutations</a>
            <ul>
                <li> <a href="#create-notification">createNotification</a></li>
                <li> <a href="#mark-as-read-or-not-read">markAsReadOrNotRead</a></li>
                <li> <a href="#mark-all-read-or-not-read">markAllReadOrNotRead</a></li>
            </ul>
        </li>
        <li><a href="#subscription">Subscription</a>
            <ul>
                <li> <a href="#subscription-notification">notification</a></li>
            </ul>
        </li>
      </ul>
     <li><a href="#services">Servicios</a></li>
        <ul>
            <li><a href="#create-notification-service">createNotificationService</a></li>
            <li><a href="#fetch-notifications-service">fetchNotificationsService</a></li>
            <li><a href="#notifications-paginate-filter-service">notificationsPaginateFilterService</a></li>
            <li><a href="#mark-as-read-or-not-read-service">markAsReadOrNotReadService</a></li>
            <li><a href="#mark-all-read-or-not-read-service">markAllReadOrNotReadService</a></li>
            <li><a href="#delete-notifications-service">deleteNotificationsService</a></li>
        </ul>
  </ul>
</div>

----

<h1 id="queries-and-mutations">Queries y mutations</h1>

<h2 id="types">Types</h2>

<h3 id="notifications-paginated">NotificationsPaginated</h3>


```graphql endpoint
type NotificationsPaginated{
    totalItems: Int
    page: Int
    items: [Notification]
}
```

Nombre  | Tipo de dato | Descripcion |
------- | -------------| --------------|
totalItems  | Integer | El número de items a devolver.|
page  | Integer | El número de página a devolver. |
items | Array of Notification type    | Las notificaciones de esa página. |

<h3 id="notification">Notification</h3>

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
id  | ID | ID de la notificación. |
user  | ID| ID del usuario dueño de la notificación. |
title | String    | El titulo de la notificación. |
content | String    | El contenido de la notificación. |
read | Boolean    | 'true' si la notificación está leida. 'false' si la notificación no está leida. |
creationDate | String    | Fecha de creación. |
type | String    | Categoría de la notificación. |
icon | String    | Icono de la notificación. |
readDate | String    | Fecha de leido. |

<h3 id="response-notification">ResponseNotification</h3>

```graphql endpoint
type ResponseNotification{
    success: Int
}
```

Nombre  | Tipo de dato | Descripcion |
------- | -------------| --------------|
success  | Integer | Devuelve 0 si la operación fue exitosa, 1 en caso de error.|

--- 

<h2 id="queries">Queries</h2>

<h3 id="fetch-notifications">fetchNotifications</h2>

**Definición y uso**

_Obtiene las notificaciones de un determinado usuario. Delega la tarea al servicio fetchNotificationsService. Retorna
una promesa._

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

Retorna un Array del type Notification. Para más información vaya a la sección <a href="#types">Types</a>

---

<h3 id="notifications-paginate-filter">notificationsPaginateFilter</h2>

**Definición y uso**

_Obtiene las notificaciones paginadas de un determinado usuario. Delega la tarea al servicio
notificationsPaginateFilterService. Retorna una promesa._

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

Retorna un Array del type Notification. Para más información vaya a la sección <a href="#types">Types</a>.

---
<h2 id="mutations">Mutations</h2>

<h3 id="create-notification">createNotification</h2>

**Definición y uso**

_Crea una notificación. Delega la tarea al servicio createNotificationService. Retorna una promesa._

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

Retorna los datos de la notificación creada. Para más información vaya a la sección <a href="#types">Types</a>

---
<h3 id="mark-all-read-or-not-read">markAllReadOrNotRead</h2>

**Definición y uso**

_Permite marcar todas las notificaciones de usuario como leídas o no leídas. Delega la tarea al servicio
markAllReadOrNotReadService. Retorna una promesa._

**Sintaxis**

```graphql endpoint

mutation: {
        markAllReadOrNotRead(isRead: Boolean):ResponseNotification
}

type ResponseNotification{
        success: Int
}

```

**Parametros**

Nombre  | Tipo de dato | Requerido | Descripcion |
------- | -------------|--------| --------------|
idUserAuth  | ID | Si | El ID del usuario a quien todas las notificaciones se marcarán como leídas o no leídas.|
readValue  | Boolean| Si| 'true' para marcar todas las notificaciones como leídas. 'false' para marcar todas las notificaciones como no leídas.|

**Datos que retorna el servicio**

Retorna los datos de la notificación modificada. Para más información vaya a la sección <a href="#types">Types</a>

---
<h2 id="subscription">Subscription</h2>

<h3 id="subscription-notification">notification</h2>

**Definición y uso**

_Permite subscribirte a las notificaciones por websocket. Delega la tarea al servicio fetchNotificationsService. Retorna
una promesa._

**Sintaxis**

```graphql endpoint
Subscription: {
        notification(user: ID!): Notification
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
user  | ID | Si | El ID del usuario el cual serán "escuchadas" sus notificaciones.|

---

<h1 id="services">Servicios disponibles</h1>

Los servicios son metodos o funciones que realizan las operaciones de alta, baja y modificacion de notificaciones. Tanto
las queries como las mutations delegan sus responsabilidades a estos servicios. Si no desea usar las queries y mutations
definidas, puede utilizar los servicios de forma independiente.

## Ejemplos de uso:

_Un ejemplo usando el método **createNotificationService**._

```js
import {createNotificationService} from "@dracul/notification-backend"

let userId = "123" //some userId
let title = "Notification Title"
let content = "Notification content"
let type = "SomeType"
let icon = "SomeIcon"

createNotificationService(
    userId,
    title,
    content,
    type,
    icon
)
    .then(notificationDocument => {
        console.log("Notification created: ", notificationDocument)
    })
    .catch(error => {
        console.error(error)
    })
```

<h2>Métodos disponibles</h2>

<h3 id="create-notificationS¿-service">createNotificationService</h3>

**Definición y uso**

_Crea una notificación. Retorna una promesa._

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

<h3 id="fetch-notifications-service">fetchNotificationsService</h3>

**Definición y uso**

_Obtiene las notificaciones de un determinado usuario. Retorna una promesa._

**Sintaxis**

```js
fetchNotificationsService(userId, limit, isRead, type)
```

**Parametros**

- **userId**: requerido. Tipo de dato ObjectID. El identificador del usuario que será usado para obtener sus
  notificaciones.
- **limit**: no requerido. Tipo de dato Integer. Representa el numero de notificaciones limite que desea obtener. Por
  defecto obtiene todas las notificaciones del usuario.
- **isRead**: requerido. Tipo de dato Boolean. 'true' si quiere obtener las notificaciones que ya fueron leidas. 'false'
  si quiere obtener solo las notificaciones no leidas. 'null' en caso de que desee obtener todas las notificaciones sin
  importar en estado de la misma.
- **type**: no requerido. Tipo de dato String. Sólo en caso de que desee filtrar las notificaciones por tipo.

---

<h3 id="notifications-paginate-filter-service">notificationsPaginateFilterService</h3>

**Definición y uso**

_Obtiene las notificaciones paginadas de un determinado usuario. Retorna una promesa._

**Sintaxis**

```js
notificationsPaginateFilterService(userId, limit, pageNumber, isRead, type)
```

**Parametros**

- **userId**: Requerido. Tipo de dato ObjectID. El identificador del usuario que será usado para obtener sus
  notificaciones.
- **limit**: No requerido. Tipo de dato Integer. Representa el numero de notificaciones limite que desea obtener. Por
  defecto obtiene todas las notificaciones del usuario.
- **pageNumber**: No requerido. Tipo de dato Integer. (Úselo para la paginación de notificaciones), el número de página
  que desea obtener. por defecto devuelve la página 1.
- **isRead**: Requerido. Tipo de dato Boolean. 'true' si quiere obtener las notificaciones que ya fueron leidas. 'false'
  si quiere obtener solo las notificaciones no leidas. 'null' en caso de que desee obtener todas las notificaciones sin
  importar en estado de la misma.
- **type**: Requerido. Tipo de dato String. Sólo en caso de que desee filtrar las notificaciones por tipo.

---

<h3 id="mark-as-read-or-not-read-service">markAsReadOrNotReadService</h3>

**Definición y uso**

_Permite marcar una notificación como leída o no leída. Retorna una promesa._

**Sintaxis**

```js
markAsReadOrNotReadService(idNotification, readValue)
```

**Parametros**

- **idNotification**: Requerido. Tipo de dato ObjectID. El identificador de la notificacion que se marcará como leida/no
  leida.
- **readValue**: Requerido. Tipo de dato Boolean. "true" para marcar la notificación como leída. 'false' para marcar la
  notificación como no leída.

---

<h3 id="mark-all-read-or-not-read-service">markAllReadOrNotReadService</h3>

**Definición y uso**

_Permite marcar todas las notificaciones de usuario como leídas o no leídas. Retorna una promesa._

**Sintaxis**

```js
markAllReadOrNotReadService(idUserAuth, readValue)
```

**Parametros**

- **idUserAuth**: requerido. Tipo de dato ObjectID. El ID del usuario a quien todas las notificaciones se marcarán como
  leídas o no leídas.
- **readValue**: requerido. Tipo de dato Boolean. 'true' para marcar todas las notificaciones como leídas. 'false' para
  marcar todas las notificaciones como no leídas.

---

<h3 id="delete-notifications-service">deleteNotificationsService</h3>

**Definición y uso**

_Elimina las notificaciones de un determinado usuario. Retorna una promesa._

**Sintaxis**

```js
deleteNotificationsService(userId, numberOfDays)
```

**Parametros**

- **userId**: requerido. Tipo de dato ObjectID. El identificador del usuario cuyas notificaciones seran eliminadas.
- **numberOfDays**: no requerido. Tipo de dato Integer. La cantidad de días que debe tener una notificación para poder
  eliminarla. De forma predeterminada, elimina las notificaciones de 30 días o más.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square

[stars-url]: https://github.com/draculjs/modular-framework/stargazers

[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square

[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
