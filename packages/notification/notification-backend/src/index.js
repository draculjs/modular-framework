import {
    createNotificationService,
    deleteNotificationsService,
    fetchNotificationsService,
    markAllReadOrNotReadService,
    markAsReadOrNotReadService,
    notificationsPaginateFilterService
} from "./services/NotificationService"

import {types, resolvers} from "./graphql"
import {startNotificacionWs} from "./WebSocketServer"
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
    //WebSocket server
    startNotificacionWs,
    //Permissions
    permissions,
    //Model
    NotificationModel
}





