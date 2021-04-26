import Notification from "../models/NotificationModel";
import {DefaultLogger as winston} from "@dracul/logger-backend";
import moment from "moment";
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
export const createNotificationService = (
    userId,
    title,
    content,
    type,
    icon
) => {
    
    return new Promise((resolve, reject) => {

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

        saveNotification(newNotification)
            .then((documentNotification) => {
                winston.info("Notificacion creada con exito: " + documentNotification.id);
                pubsub.publish('notification', documentNotification)
                resolve(documentNotification);
            })
            .catch((err) => {
                winston.error("Error al crear la notificacion. Error: ", err);
                reject(err);
            });
    });
};

/**
 * Save a notification document in the MongoDB collection
 *
 * @param {Object} documentNotification
 * @return {Promise}
 */
const saveNotification = (documentNotification) => {
    return new Promise((resolve, reject) => {
        documentNotification.save((error, docNotification) => {
            if (error) {
                winston.error("Error al guardar la notificacion. Error: ", error);
                reject(error);
            }
            resolve(docNotification);
        });
    });
};

/**
 * Get notifications from a certain user
 *
 * @param {ObjectId} userId
 * @param {Integer} limit
 * @param {Boolean} isRead
 * @param {String} type
 * @return {Promise}
 */
export const fetchNotificationsService = (userId, limit = 0, isRead, type) => {
    return new Promise((resolve, reject) => {
        let query = getFilters(userId, isRead, type);

        Notification.find(query)
            .sort({creationDate: -1})
            .limit(limit)
            .populate("user")
            .exec(function (err, documents) {
                if (err) {
                    winston.error(
                        "No se pudo obtener las notificaciones del usuario: " +
                        userId +
                        " error: ",
                        error
                    );
                    rejects(err);
                }
                winston.info(
                    "Notificaciones obtenidas con exito del usuario: " + userId
                );
                resolve(documents);
            });
    });
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
export const markAsReadOrNotReadService = (idNotification, readValue) => {
    return new Promise((resolve, reject) => {
        //Si readValue es true, necesitamos guardar la fecha de leido
        let query = getReadDate(readValue);

        Notification.findOneAndUpdate({_id: idNotification}, query, {new:true})
            .then((documentNotification) => {
                resolve(documentNotification);
            })
            .catch((err) => {
                winston.error("Error al marcar la notificacion, error: ", err);
                reject(err);
            });
    });
};

/**
 * Allows marking all user notifications as read or not read
 *
 * @param {ObjectId} idUserAuth
 * @param {Boolean} readValue
 * @return {Promise}
 */
export const markAllReadOrNotReadService = (idUserAuth, readValue) => {
    //Si readValue es true, necesitamos guardar la fecha de leidos
    let query = getReadDate(readValue);

    return new Promise((resolve, reject) => {
        Notification.updateMany({user: idUserAuth, read: readValue}, query)
            .exec(function (err, documentsNotification) {
                if (err) {
                    winston.error("Error al marcar las notificaciones, error: ", err);
                    reject(err);
                }
                resolve({success: documentsNotification.ok});
            });
    });
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
    
    let today = moment();
    let until = moment().add(numberOfDays, "days");

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
