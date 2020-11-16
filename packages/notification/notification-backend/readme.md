# Dracul notification module


## Create notification

```js
import {createNotificationService} from "@dracul/notification-backend"

let userId = "123" //some userId
let title = "Notification Title"
let content = "notification content"
let type = "SomeType"
let icon =  "someIcon"

createNotificationService(
    userId,
    title,
    content,
    type,
    icon
)
```
