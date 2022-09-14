import { updateByRelativePath } from "../services/FileService"


export default function (req, res, next) {
    try {

        // Elimino la primera barra para poder comparar contra el campo 'relativePath' del modelo
        let uri_dec = decodeURIComponent(req.originalUrl).replace('/', '');
        if(!req.headers.toString().includes("Content-Range")){
            updateByRelativePath(uri_dec)
        }

        next()
    } catch (error) {
        console.error("updateFileMiddleware error:", error)
        next(error);
    }

}

