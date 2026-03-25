import { requireAuthentication } from "@dracul/access-backend"
import { FileService } from "@dracul/media-backend"
import { mediaCache } from "../index"
import { DefaultLogger as winston } from "@dracul/logger-backend"
import path from "path"

export async function checkFilePrivacy(req, res, next) {
    try {
        const relativePath = path.join('media/files', req.path)

        winston.debug(`privateFilesMiddleware.checkFilePrivacy: checking privacy for '${relativePath}'`)

        const loader = (key) => FileService.getFilePrivacyByRelativePath(key)
        const file = await mediaCache.getOrLoad(relativePath, loader)

        if (!file || !file.isPublic) {
            winston.debug(`privateFilesMiddleware.checkFilePrivacy: '${relativePath}' is private, requiring authentication`)
            return requireAuthentication(req, res, next)
        }

        winston.debug(`privateFilesMiddleware.checkFilePrivacy: '${relativePath}' is public, allowing access`)
        return next()
    } catch (error) {
        winston.error(`privateFilesMiddleware.checkFilePrivacy error: ${error.message}`, { error: error.stack, path: req.path })
        return res.status(500).send("Internal Server Error")
    }
}
