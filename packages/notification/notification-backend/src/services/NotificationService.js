import Notification from "../models/NotificationModel";
import {DefaultLogger as winston} from "@dracul/logger-backend";
import dayjs from "dayjs"
import {pubsub} from '../PubSub'
import mongoose from "mongoose";

/**
 * Create an user notification
 *
 * @param {ObjectId} userId
 * @param {string} title
 * @param {string} content
 * @param {string} type
 * @param {string} icon
 * @return {Promise}
 */
export const createNotificationService = async (
    userId,
    title,
    content,
    type,
    icon
) => {


    try{
        if(!userId)
            throw new Error("userId must be provider")
        if(!mongoose.isValidObjectId(userId))
            throw new Error("userId must be a valid objectId")
        if(!title)
            throw new Error("title must be provider")
        if(!content)
            throw new Error("content must be provider")

        let newNotification = new Notification({
            user: userId,
            title,
            content,
            type,
            icon,
            creationDate: Date.now(),
            readDate: null,
            read: false,
        });

        newNotification.id = newNotification._id;

        await newNotification.save()
        pubsub.publish('notification', newNotification)
        return newNotification
    }catch (e) {
        winston.error("Error al crear la notificacion. Error: ", e);
        throw e
    }


}

/**
 * Get notifications from a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} limit
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Promise}
 */
export const fetchNotificationsService = async (userId, limit = 0, isRead, type) => {

    try{
        let query = getFilters(userId, isRead, type);
        let notifications = await  Notification.find(query)
            .sort({creationDate: -1})
            .limit(limit)
            .populate("user")
            .exec()
        return notifications
    }catch (e) {
        winston.error("No se pudo obtener las notificaciones del usuario: " + userId + " error: ", e);
        throw e
    }
};

/**
 * Get notifications filters paginate from a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} limit
 * @param {Integer} pageNumber
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Promise}
 */
export const notificationsPaginateFilterService = (
    userId,
    limit = 5,
    pageNumber = 1,
    isRead,
    type
) => {
    let query = getFilters(userId, isRead, type)

    let params = {page: pageNumber, limit: limit, sort: {creationDate: -1}}

    return new Promise((resolve, reject) => {

        Notification.paginate(query, params)
            .then(result => {
                resolve({totalItems: result.totalDocs, page: result.page, items: result.docs})
            })
            .catch(err => {
                winston.error("Error al filtrar y paginas las notificaciones, error: ", err);
                reject(err)
            })
    })
};


/**
 * Get an object query with the filters requested by the user
 *
 * @param {ObjectId} userId
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Object}
 */
const getFilters = (userId, isRead, type) => {
    let query = {user: userId};

    if (isRead == null) {
        query = {...query, $or: [{read: true}, {read: false}]};
    } else {
        query = {...query, read: isRead};
    }

    if (type) {
        query = {...query, type: type};
    }

    return query;
};

/**
 * Allows marking a notification as read or not read
 *
 * @param {ObjectId} userNotification
 * @param {Boolean} readValue
 * @return {Promise}
 */
export const markAsReadOrNotReadService = async (idNotification, readValue) => {

    try{
        const notification = await Notification.findOneAndUpdate({_id: idNotification}, query, {new:true}).exec()
        return notification
    }catch (e) {
        winston.error("Error al marcar la notificacion, error: ", e);
        throw e
    }

};

/**
 * Allows marking all user notifications as read or not read
 *
 * @param {ObjectId} idUserAuth
 * @param {Boolean} readValue
 * @return {Promise}
 */
export const markAllReadOrNotReadService = async (idUserAuth, readValue) => {

    try{
        let query = getReadDate(readValue);
        const notifications = await Notification.updateMany({user: idUserAuth, read: readValue}, query).exec()
        return {success: documentsNotification.ok}
    }catch (e) {
        winston.error("Error al marcar las notificaciones, error: ", e)
        throw e
    }

};

/**
 * Returns an object query, which will be used to save the read notification date in the DB.
 * In the case that the notification is marked as unread, the value where the date is stored will have the value null
 *
 * @param {Boolean} readValue
 * @return {Object}
 */
const getReadDate = (readValue) => {
    //Lo invertimos para pasar la notificacion al estado contrario
    let nextValue = !readValue;

    let query = {read: nextValue};

    if (nextValue) {
        query = {...query, readDate: Date.now()};
    } else {
        query = {...query, readDate: null};
    }

    return query;
};


/**
 * Delete stored notifications for a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} numberOfDays
 * @return {Promise}
 */
export const deleteNotificationsService = (userId, numberOfDays = 30) => {

    let today = dayjs();
    let until = dayjs().add(numberOfDays, "day");

    return new Promise((resolve, reject) => {
        let query = {
            user: userId,
            creationDate: {$ne: [{$gte: today, $lte: until}]},
        };

        Notification.deleteMany(query)
            .then((res) => {
                winston.info("Notificaciones antiguas borradas con exito");
                resolve(res);
            })
            .catch((err) => {
                winston.error("No se pudo eliminar las notificaciones antiguas");
                reject(err);
            });
    });
};

/**
 * Get the way to fetch notifications
 * @return {Promise}
 */
export const fetchNotificationMethodService = () => {

    return new Promise((resolve, reject) => {

        const WEB_SOCKET_STATE = ["enable","disable"]
        if(!process.env.NOTIFICATION_TIME_POLLING && !/^[0-9]+$/.test(process.env.NOTIFICATION_TIME_POLLING)) return reject(new Error("ENV VAR NOTIFICATION_TIME_POLLING must be a number!"))
        if(!WEB_SOCKET_STATE.includes(process.env.NOTIFICATION_ACTIVATE_WEB_SOCKET)) return reject(new Error("ENV VAR NOTIFICATION_ACTIVATE_WEB_SOCKET must be 'enable' or 'disable'!"))

        let enableWs = process.env.NOTIFICATION_ACTIVATE_WEB_SOCKET == "enable" ? true : false
        let timePolling = !process.env.NOTIFICATION_TIME_POLLING ? parseInt(process.env.NOTIFICATION_TIME_POLLING) : 30000
        resolve({enableWs: enableWs, timePolling: timePolling})
    })
}
