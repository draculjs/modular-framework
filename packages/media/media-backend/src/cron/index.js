import { DefaultLogger as winston } from "@dracul/logger-backend";
import { findAndDeleteExpiredFiles } from "../modules/media/services/FileService"
import cron from "node-cron";

require("dotenv").config();

/**
 * @description
 * findAndDeleteExpiredFiles: encuentra archivos expirados y los elimina.
 * */
export const cronManager = () => {
    if (!cron.validate(process.env.MEDIA_DELETE_FILES_CRON)) {
        throw new Error("Valor de variable de entorno MEDIA_DELETE_FILES_CRON no válido")
    }
    if (process.env.MEDIA_DELETE_FILES_CRON) {
        cron.schedule(process.env.MEDIA_DELETE_FILES_CRON, async () => {
            winston.info("CronManager findAndDeleteExpiredFiles starting ");
            try {
                const success = await findAndDeleteExpiredFiles();
                winston.info("CronManager findAndDeleteExpiredFiles finished. Deleted count " + success.deletedCount);
            } catch (e) {
                winston.error("CronManager findAndDeleteExpiredFiles error", e);
            }
        }, { scheduled: true });
    }
};

