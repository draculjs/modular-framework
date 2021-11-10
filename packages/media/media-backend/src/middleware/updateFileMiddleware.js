import { updateByRelativePath } from "../modules/media/services/FileService"


export default function (req, res, next) {
    try {

        // Elimino la primera barra para poder comparar contra el campo 'relativePath' del modelo
        let uri_dec = decodeURIComponent(req.originalUrl).replace('/', '');
        updateByRelativePath(uri_dec)

        next()
    } catch (error) {
        console.error("updateFileMiddleware error:", error)
        next(error);
    }

}

