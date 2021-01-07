[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul notification module

This module contains components that allow you to view the notifications created with the notification module backend.

## This module contains the following components:

- A bell button where the number of notifications are displayed.
- A section where all the notifications of a certain user are listed, where the user can view notifications and mark them as read or unread.

## Installation:

```
npm i @dracul/notification-frontend
```

## Usage example:

_An example of using the **NotificationButton** component*._

```js
<template>
    <div>
        <notification-button :userId="123"/>
    </div>
</template>

<script>
    import {NotificationButton} from '@dracul/notification-frontend'

    export default {
    name:"SomeName",
    components: {NotificationButton}
}

</script>
```

## Components available

### NotificationButton

**Definition and usage**

_A button with a bell icon showing the number of notifications received. 
Also, if you press the button, a small list with more detailed notifications will be displayed._

**Import component**
```js
import {NotificationButton} from '@dracul/notification-frontend'
```

**Props**

|Name  |Type |Description      | 
|----------|----------|----------------------------------------------------------------------------------------------|
|`userId`   |ObjectID  | Required. The user ID to whom the notifications will be shown.                                                                   |
|`colorIcon`  |String   |Required. Will be used as the color of the bell icon. Value default: 'onPrimary'.                                                                    |


---


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors

