import FileService from "../services/FileService";


export default function updateFileMiddleware (req, res, next) {
    try {
        const uri_dec = decodeURIComponent(req.originalUrl).replace('/', '');
        if (!req.headers.range) FileService.updateByRelativePath(uri_dec)

        next()
    } catch (error) {
        console.error("updateFileMiddleware error:", error)
        next(error);
    }

}

