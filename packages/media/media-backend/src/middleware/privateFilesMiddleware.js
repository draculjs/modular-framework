import { requireAuthentication } from "@dracul/access-backend"
import { FileService } from "@dracul/media-backend"
import { mediaCache } from "../index"
import path from "path"

export async function checkFilePrivacy(req, res, next) {
    try {
        const relativePath = path.join('media/files', req.path)

        const loader = (key) => FileService.getFilePrivacyByRelativePath(key)
        const file = await mediaCache.getOrLoad(relativePath, loader)

        if (!file || !file.isPublic) return requireAuthentication(req, res, next)

        return next()
    } catch (error) {
        console.error("Error in checkFilePrivacy middleware:", error)
        return res.status(500).send("Internal Server Error")
    }
}