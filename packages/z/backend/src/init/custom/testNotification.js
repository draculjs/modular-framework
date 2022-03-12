import {
    createNotificationService
} from '@dracul/notification-backend'

import {UserService} from '@dracul/user-backend'

export const testNotification = async function () {

    let user = await UserService.findUserByUsername('root')

    let notification = {
        userId: user.id,
        title: "Hello God!",
        content: "This is a test notification",
        type: "Test",
        icon: "person"
    }
    await createNotificationService(
        notification.userId,
        notification.title,
        notification.content,
        notification.type,
        notification.icon
    )

    return
}
