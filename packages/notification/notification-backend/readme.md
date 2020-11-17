[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul Notification Module

The Notification Module allows you to create and manage notifications with information about any action in your project.

## This module allows:

- Create notifications.
- Mark notifications as read or unread.
- Filter notifications by type or date both received and read.
- Get notifications paginated.
- Delete notifications based on their creation date.

## Installation

```
npm i @dracul/notification-backend
```

## Usage example

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


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
