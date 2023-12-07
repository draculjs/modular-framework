import { FILE_SHOW_ALL, FILE_SHOW_OWN, FILE_CREATE, FILE_SHOW_PUBLIC } from "../../permissions/File";
import { findFile, paginateFiles, updateFileRest } from "../../services/FileService";
import { fileUpload } from "../../services/UploadService";
import FileDTO from '../../DTOs/FileDTO.js'

import { DefaultLogger as winston } from '@dracul/logger-backend';
import { Readable } from 'stream';
import express from 'express';
import multer from 'multer';

const upload = multer()
const router = express.Router()

router.get('/files/:id', async function (req, res) {
    try {
        const userIsAuthenticated = req.user

        const userCanSeeAllFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_ALL)
        const userCanSeeItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_OWN)
        const userCanSeePublicFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_PUBLIC)

        if (!userIsAuthenticated || !req.rbac) res.status(401).json({ message: "Not authenticated" })
        if (!userCanSeeAllFiles && !userCanSeeItsOwnFiles) res.status(403).json({ message: "Not Authorized" })

        const file = await findFile(req.params.id, req.user.id, userCanSeeAllFiles, userCanSeeItsOwnFiles, userCanSeePublicFiles)

        if (!file) {
            res.status(404).json({ message: 'File not found' })
        } else {
            res.status(200).json(new FileDTO(file))
        }

    } catch (error) {
        winston.error(`An error happened at the file by id router: '${error}'`)
        res.status(500).json({ message: error.message })
    }
})

router.get('/files', async function (req, res) {
    try {
        const userIsAuthenticated = req.user

        const userCanSeeAllFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_ALL)
        const userCanSeeItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_OWN)
        const userCanSeePublicFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_PUBLIC)

        if (!userIsAuthenticated) {
            res.status(401).send("Unauthenticated")
            return
        }

        if (!userCanSeeAllFiles && !userCanSeeItsOwnFiles && !userCanSeePublicFiles) {
            res.status(403).send("Unauthorized")
            return
        }

        const hideSensitiveData = true
        const paginatedFiles = await paginateFiles(
            req.query, req.user.id, userCanSeeAllFiles,
            userCanSeeItsOwnFiles, userCanSeePublicFiles,
            hideSensitiveData
        )

        if (!paginatedFiles) {
            res.status(404).json({ message: 'We didnt found any files' })
            return
        } else {
            res.status(200).json(paginatedFiles)
            return
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/files', upload.single('file'), async function (req, res) {
    try {
        if (!req.user) res.status(401).json({ message: "Not Authorized" })
        if (!req.rbac.isAllowed(req.user.id, FILE_CREATE)) res.status(403).json({ message: "Not Authorized" })
        if (!req.file) res.status(400).json({ message: 'File was not provided' })

        let { expirationTime, isPublic, description, tags } = req.body

        if (tags && typeof tags === 'string' && tags.length > 0) {
            tags = tags.split(',').map(tag => tag.trim())
        }

        const file = {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            createReadStream: () => Readable.from(req.file.buffer),
            encoding: req.file.encoding,
        }

        const fileUploadingResult = await fileUpload(req.user, file, expirationTime, isPublic, description, tags)
        res.status(201).send(fileUploadingResult.id)
    } catch (error) {
        console.error(`An error happened at the file uploading endpoint: '${error}'`)
        res.status(409).send("An error happened when we tried to upload the file")
    }
})


router.patch('/files/:id', async function (req, res) {
    try {
        const userIsAuthenticated = req.user

        const userCanSeeAllFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_ALL)
        const userCanSeeItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_OWN)
        const permissionType = (userCanSeeAllFiles) ? FILE_SHOW_ALL : (userCanSeeItsOwnFiles) ? FILE_SHOW_OWN : null

        if (!userIsAuthenticated) {
            res.status(401).send("Not authenticated")
            return
        }

        if (!userCanSeeAllFiles && !userCanSeeItsOwnFiles) {
            res.status(403).send("Not Authorized")
            return
        }

        const fileToUpdateId = req.params.id
        const { description, expirationDate, tags, isPublic } = req.body

        if ( !fileToUpdateId ) throw new Error("You must provide the ID of the file you want to update")
        if ( !description && !expirationDate && !tags && !isPublic ) {
            const noNewValuesError = new Error(
                'You must provide new values for any of the following file fields: description, expirationDate, tags, or isPublic'
            )
            throw noNewValuesError
        }

        const updateFileResult = await updateFileRest(req.params.id, req.user, permissionType, { description, expirationDate, tags, isPublic })
        if (!updateFileResult) {
            throw new Error("An error happened: we didnt get an update file operation's result")
        } else {
            res.status(200).json(updateFileResult)
            return
        }
    } catch (error) {
        winston.error(`An error happened at the PATCH files/:id endpoint: '${error}'`)
        res.status(500).send(error)
    }
})

export { router };
export default router;