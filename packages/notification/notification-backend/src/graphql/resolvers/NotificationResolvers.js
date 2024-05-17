import {markAsReadOrNotReadService, markAllReadOrNotReadService, fetchNotificationsService,createNotificationService,notificationsPaginateFilterService,fetchNotificationMethodService} from '../../services/NotificationService'

import {AuthenticationError, ForbiddenError} from 'apollo-server-errors';

import{
    NOTIFICATION_SHOW,
    NOTIFICATION_CREATE,
    NOTIFICATION_UPDATE
} from '../../permissions'


const { withFilter } = require('graphql-subscriptions');
import {pubsub} from '../../PubSub'

export default{
    Query:{
        fetchNotifications:(_,{limit, isRead,type},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, NOTIFICATION_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchNotificationsService(user.id,limit,isRead,type)
        },
        notificationsPaginateFilter:(_,{limit, pageNumber, isRead, type},{user, rbac})=>{
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, NOTIFICATION_SHOW)) throw new ForbiddenError("Not Authorized")
            return notificationsPaginateFilterService(user.id,limit, pageNumber, isRead, type)
        },
        fetchNotificationMethod:(_,{},{user, rbac})=>{
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, NOTIFICATION_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchNotificationMethodService()
        }
    },
    Mutation:{
        markAsReadOrNotRead:(_,{id, isRead},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, NOTIFICATION_UPDATE)) throw new ForbiddenError("Not Authorized")
            return markAsReadOrNotReadService(id, isRead)
        },
        markAllReadOrNotRead:(_,{isRead},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, NOTIFICATION_UPDATE)) throw new ForbiddenError("Not Authorized")
            return markAllReadOrNotReadService(user.id, isRead)
        },
        createNotification:(_,{title,content, type, icon},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, NOTIFICATION_CREATE)) throw new ForbiddenError("Not Authorized")
            return createNotificationService(user.id,title,content,type,icon)
        },
        createNotificationTest:(_,{user, title,content, type, icon}) => {
            return createNotificationService(user,title,content,type,icon)
        }
    },
    Subscription: {
        notification: {
            resolve: (payload) => {
                return payload; //Manipulate at you wish
            },
            subscribe: withFilter(
            () => pubsub.asyncIterator('notification'),
            (payload, variables) => {
                console.log("payload", payload);
                console.log("variables", variables);
                console.log("compare", payload.user.toString() === variables.user);
                return payload.user.toString() === variables.user;
            })
        }
    }
}
