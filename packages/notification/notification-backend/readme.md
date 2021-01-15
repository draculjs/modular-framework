[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]

# Dracul Notification Module

The Notification Module allows you to create and manage notifications with information about any action in your project..

## This module allows:

- Create notifications.
- Mark notifications as read or unread.
- Filter notifications by type or date both received and read.
- Get notifications paginated.
- Delete notifications based on their creation date.

## Installation:

```
npm i @dracul/notification-backend
```

## Table of Contents

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
     <li><a href="#services">Services</a></li>
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

Name  | Type| Description |
------- | -------------| --------------|
totalItems  | Integer | The number of items to return.|
page  | Integer | The page number to return. |
items | Array of Notification type   |Notifications from that page. |

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

Name  | Type| Description |
------- | -------------| --------------|
id  | ID | Notification ID. |
user  | ID| ID of the user who owns the notification. |
title | String  | The title of the notification. |
content | String  | The content of the notification. |
read | Boolean  | 'true' if the notification is read. 'false' if the notification is not read. |
creationDate | String  | Creation date. |
type | String  | Notification category. |
icon | String  | Notification icon. |
readDate | String  | Date of reading. |

<h3 id="response-notification">ResponseNotification</h3>

```graphql endpoint
type ResponseNotification{
    success: Int
}
```

Name  | Type| Description |
------- | -------------| --------------|
success  | Integer | Returns 0 if the operation was successful, 1 if it failed.|

--- 

<h2 id="queries">Queries</h2>

<h3 id="fetch-notifications">fetchNotifications</h2>

**Definition and usage**

_Gets the notifications of a specific user. Delegates the task to the fetchNotificationsService service. Returns
a promise._

**Syntax**

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

**Parameters values**

Name  | Type | Required | Description |
------- | -------------|--------| --------------|
limit  | Integer | No | Represents the number of limit notifications you want to get. By default it gets all user notifications.|
isRead  | Boolean| Yes| 'true' if you want to get the notifications that have already been read. 'false' if you want to get only unread notifications. 'null' in case you want to get all the notifications regardless of their status.|
type | String    | No | Just in case you want to filter the notifications by type. |

**Data returned by the service**

Returns an Array of the type Notification. For more information go to the section <a href="#types">Types</a>

---

<h3 id="notifications-paginate-filter">notificationsPaginateFilter</h2>

**Definition and usage**

_Gets the paginated notifications of a certain user. Delegate the task to the service
notificationsPaginateFilterService. Returns a promise._

**Syntax**

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

**Parameters values**

Name  | Type | Required | Description |
------- | -------------|--------| --------------|
limit  | Integer | No | Represents the number of limit notifications you want to get. By default it gets all user notifications.|
isRead  | Boolean| Yes| 'true' if you want to get the notifications that have already been read. 'false' if you want to get only unread notifications. 'null' in case you want to get all the notifications regardless of their status.|
type | String    | No | Just in case you want to filter the notifications by type. |

**Data returned by the service**

Returns an Array of the type Notification. For more information go to the section <a href="#types">Types</a>.

---
<h2 id="mutations">Mutations</h2>

<h3 id="create-notification">createNotification</h2>

**Definition and usage**

_Create a notification. Delegates the task to the createNotificationService service. Returns a promise._

**Syntax**

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

**Parameters values**

Name  | Type | Required | Description |
------- | -------------|--------| --------------|
title  | String | Yes | It will be used as the title of the notice.|
content  | String| Yes| It will be used as the content of the notification.|
type | String | Yes | It will be used as the category of the notification. |
icon | String | Yes | It will be used as the icon that represents the notification.|

**Data returned by the service**

Returns the data of the created notification. For more information go to the section <a href="#types">Types</a>

---
<h3 id="mark-all-read-or-not-read">markAllReadOrNotRead</h2>

**Definition and usage**

_Allows you to mark all user notifications as read or unread. Delegate the task to the service
markAllReadOrNotReadService. Returns a promise._

**Syntax**

```graphql endpoint

mutation: {
        markAllReadOrNotRead(isRead: Boolean):ResponseNotification
}

type ResponseNotification{
        success: Int
}

```

**Parameters values**

Name  | Type | Required | Description |
------- | -------------|--------| --------------|
idUserAuth  | ID | Yes | The ID of the user to whom all notifications will be marked as read or unread.|
readValue  | Boolean| Yes| 'true' to mark all notifications as read. 'false' to mark all notifications as unread.|

**Data returned by the service**

Returns the data of the modified notification. For more information go to the section <a href="#types">Types</a>

---
<h2 id="subscription">Subscription</h2>

<h3 id="subscription-notification">notification</h2>

**Definition and usage**

_Allows you to subscribe to websocket notifications. Delegates the task to the fetchNotificationsService service. Returns
a promise._

**Syntax**

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

**Parameters values**

Name  | Type | Required | Description |
------- | -------------|--------| --------------|
user  | ID | Yes | The ID of the user whose notifications will be "listened to".|

---

<h1 id="services">Available services</h1>

The services are methods or functions that perform the operations of registration, cancellation and modification of notifications. So much
queries and mutations delegate their responsibilities to these services. If you don't want to use queries and mutations
defined, you can use the services independently.

## Usage example:

_Usage example for the **createNotificationService** method._

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

## Available methods

### createNotificationService

**Definition and usage**

_Create an user notification.
Return a promise._

**Syntax**
```js
createNotificationService(userId, title, content, type, icon)
```

**Parameters values**

- **userId**: required. ObjectID type. The ID user to whom the notification will be created.

- **title**: required. String type. Will be used as the notification title.

- **content**: required. String type. Will be used as the notification content.

- **type**: required. String type. It will be used to categorize the notifications.

- **icon**: required. String type. Will be used as the notification icon.

---

### fetchNotificationsService

**Definition and usage**

_Get notifications from a certain user.
Return a promise._

**Syntax**
```js
fetchNotificationsService(userId, limit, isRead, type)
```

**Parameters values**

- **userId**: required. ObjectID type. The user ID to get their notifications.
- **limit**: not required. Integer type. The number of notifications you want to get. By default it returns all.
- **isRead**: required. Boolean type. 'true' if you want to get the notifications that have been read. 'false' if you want to get the notifications that were not read. 'null' wants to get all notifications regardless of status.
- **type**: not required. String type. If you want to filter notifications by type field.

---

### notificationsPaginateFilterService

**Definition and usage**

_Get notifications filters paginate from a certain user.
Return a promise._

**Syntax**
```js
notificationsPaginateFilterService(userId, limit, pageNumber, isRead, type)
```

**Parameters values**

- **userId**: required. ObjectID type. The user ID to get their notifications.
- **limit**: not required. Integer type. The number of notifications you want to get. By default it returns all.
- **pageNumber**: not required. Integer type. (Use it for the paging of notifications), the page number you want to obtain. by default returns page 1.
- **isRead**: required. Boolean type. 'true' if you want to get the notifications that have been read. 'false' if you want to get the notifications that were not read. 'null' wants to get all notifications regardless of status.
- **type**: required. String type. If you want to filter notifications by type field.

---

### markAsReadOrNotReadService

**Definition and usage**

_Allows marking a notification as read or not read.
Return a promise._


**Syntax**
```js
markAsReadOrNotReadService(idNotification, readValue)
```

**Parameters values**

- **idNotification**: required. ObjectID type. ID notification that will be marked as read or unread.
- **readValue**: required. Boolean type. 'true' to mark the notification as read. 'false' to mark the notification as unread.

---

### markAllReadOrNotReadService

**Definition and usage**

_Allows marking all user notifications as read or not read.
Return a promise._

**Syntax**
```js
markAllReadOrNotReadService(idUserAuth, readValue)
```

**Parameters values**

- **idUserAuth**: required. ObjectID type. user ID to whom all notifications will be marked as read or unread.
- **readValue**: required. Boolean type. 'true' to mark all the notifications as read. 'false' to mark all the notifications as unread.

---

### deleteNotificationsService

**Definition and usage**

_Delete stored notifications for a certain user.
Return a promise._

**Syntax**
```js
deleteNotificationsService(userId, numberOfDays)
```

**Parameters values**

- **userId**: required. ObjectID type. The ID of the user whose notifications will be removed.
- **numberOfDays**: not required. Integer type. The number of days old a notification must be in order to be deleted. By default it removes notifications 30 days or more old.

---

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square

[stars-url]: https://github.com/draculjs/modular-framework/stargazers

[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square

[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
