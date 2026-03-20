import FileService from "../services/FileService";
import { DefaultLogger as winston } from "@dracul/logger-backend";

export default function updateFileMiddleware(req, res, next) {
    try {
        const uri_dec = decodeURIComponent(req.originalUrl).replace('/', '');
        
        if (!req.headers.range) {
            winston.debug(`updateFileMiddleware: updating lastAccess for '${uri_dec}'`);
            FileService.updateByRelativePath(uri_dec)
        }

        next()
    } catch (error) {
        winston.error(`updateFileMiddleware error: ${error.message}`, { error: error.stack, url: req.originalUrl });
        next(error);
    }
}
