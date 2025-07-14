import {
    createNotificationService, deleteNotificationsService, fetchNotificationsService, markAllReadOrNotReadService,
    markAsReadOrNotReadService, notificationsPaginateFilterService,
} from "./services/NotificationService.js"

import {types, resolvers} from "./graphql/index.js"
import * as permissions from "./permissions/index.js"
import NotificationModel from "./models/NotificationModel.js"

export{
    createNotificationService,
    deleteNotificationsService,
    fetchNotificationsService,
    markAsReadOrNotReadService,
    markAllReadOrNotReadService,
    notificationsPaginateFilterService,
    types,
    resolvers,
    permissions,
    NotificationModel
}





