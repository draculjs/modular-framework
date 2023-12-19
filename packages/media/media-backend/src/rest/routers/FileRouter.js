import { FILE_SHOW_ALL, FILE_SHOW_OWN, FILE_CREATE, FILE_SHOW_PUBLIC, FILE_UPDATE_OWN, FILE_UPDATE_ALL } from "../../permissions/File";
import { findFile, paginateFiles, updateFileRest } from "../../services/FileService";
import { fileUpload } from "../../services/UploadService";
import FileDTO from '../../DTOs/FileDTO.js'

import { DefaultLogger as winston } from '@dracul/logger-backend';
import { requireAuthentication, requireAuthorization } from '@dracul/access-backend';
import { Readable } from 'stream';
import express from 'express';
import multer from 'multer';

const upload = multer()
const router = express.Router()

router.get('/file/:id', [requireAuthentication, requireAuthorization([FILE_SHOW_ALL, FILE_SHOW_PUBLIC, FILE_SHOW_OWN])], async function (req, res) {
    try {
        const userCanSeeAllFiles = req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL)
        const userCanSeeItsOwnFiles = req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)
        const userCanSeePublicFiles = req.rbac.isAllowed(req.user.id, FILE_SHOW_PUBLIC)

        const file = await findFile(req.params.id, req.user.id, userCanSeeAllFiles, userCanSeeItsOwnFiles, userCanSeePublicFiles)

        if (!file) {
            res.status(404).send('File not found')
        } else {
            res.status(200).json(new FileDTO(file))
        }
    } catch (error) {
        winston.error(`An error happened at the file by id router: '${error}'`)
        res.status(500).send(error)
    }
})

router.get('/file', [requireAuthentication, requireAuthorization([FILE_SHOW_ALL, FILE_SHOW_PUBLIC, FILE_SHOW_OWN])], async function (req, res) {
    try {
        const userCanSeeAllFiles = req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL)
        const userCanSeeItsOwnFiles = req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)
        const userCanSeePublicFiles = req.rbac.isAllowed(req.user.id, FILE_SHOW_PUBLIC)

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

router.post('/file', [requireAuthentication, requireAuthorization([FILE_CREATE]), upload.single('file')], async function (req, res) {
    try {
        if (!req.file) res.status(400).json({ message: 'File was not provided' })

        let { expirationTime, isPublic, description, tags } = req.body
        if (tags && typeof tags === 'string' && tags.length > 0) tags = tags.split(',').map(tag => tag.trim())

        const file = {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            createReadStream: () => Readable.from(req.file.buffer),
            encoding: req.file.encoding,
        }

        const fileUploadingResult = await fileUpload(req.user, file, expirationTime, isPublic, description, tags)
        res.status(201).send(fileUploadingResult)
    } catch (error) {
        console.error(`An error happened at the file uploading endpoint: '${error}'`)
        if (error.code === 'MAX_FILE_SIZE_EXCEEDED'){
            res.status(413).send(error.message)
        }else{
            res.status(409).send("An error happened when we tried to upload the file")
        }
    }
})


router.patch('/file/:id', [requireAuthentication, requireAuthorization([FILE_UPDATE_ALL, FILE_UPDATE_OWN])], async function (req, res) {
    try {        
        const fileToUpdateId = req.params.id
        const { description, expirationDate, tags, isPublic } = req.body

        if ( !fileToUpdateId ) throw new Error("You must provide the ID of the file you want to update")
        if ( !description && !expirationDate && !tags && !isPublic ) {
            throw new Error(
                'You must provide new values for any of the following file fields: description, expirationDate, tags, or isPublic'
            )
        }

        const userCanSeeAllFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_ALL)
        const userCanSeeItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_OWN)
        const permissionType = (userCanSeeAllFiles) ? FILE_SHOW_ALL : (userCanSeeItsOwnFiles) ? FILE_SHOW_OWN : null

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