import {
    createNotificationService,
    deleteNotificationsService,
    fetchNotificationsService,
    markAllReadOrNotReadService,
    markAsReadOrNotReadService,
    notificationsPaginateFilterService
} from "./services/NotificationService"

import {types, resolvers} from "./graphql"
import * as permissions from "./permissions"
import NotificationModel from "./models/NotificationModel"

export{
    //Services
    createNotificationService,
    deleteNotificationsService,
    fetchNotificationsService,
    markAsReadOrNotReadService,
    markAllReadOrNotReadService,
    notificationsPaginateFilterService,
    //Types and resolvers
    types,
    resolvers,
    //Permissions
    permissions,
    //Model
    NotificationModel
}





