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

router.get('/file/:id', async function (req, res) {
    try {
        const userCanSeeAllFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_ALL)
        const userCanSeeItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_OWN)
        const userCanSeePublicFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_PUBLIC)

        if (!req.user || !req.rbac) res.status(401).json({ message: "Not Authorized" })
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

router.get('/file', async function (req, res) {
    try {
        if (!req.user) res.status(401).json({ message: "Not Authorized" })
        if (!req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)) res.status(403).json({ message: "Not Authorized" })

        let allFilesAllowed = req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL)
        let ownFilesAllowed = req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)
        let publicAllowed = req.rbac.isAllowed(req.user.id, FILE_SHOW_PUBLIC)

        const { pageNumber, itemsPerPage, search, orderBy, orderDesc } = req.query
        
        const hideSensitiveData = true
        const paginatedFiles = await paginateFiles({ pageNumber, itemsPerPage, search, orderBy, orderDesc },
            req.user.id, allFilesAllowed, ownFilesAllowed, publicAllowed, hideSensitiveData
        )
        
        if (!paginatedFiles) res.status(404).json({ message: 'File not found' })
        res.status(200).json(paginatedFiles)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/file', upload.single('file'), async function (req, res) {
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
        res.status(201).json(fileUploadingResult)
    } catch (error) {
        console.error(`An error happened at the file uploading endpoint: '${error}'`)
        res.status(409).send("An error happened when we tried to upload the file")
    }
})


router.patch('/file/:id', async function (req, res) {

    if (!req.user) res.status(401).json({ message: "Not Authorized" })
    if (!req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)) res.status(403).json({ message: "Not Authorized" })
    let permissionType = (req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL)) ? FILE_SHOW_ALL : (req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)) ? FILE_SHOW_OWN : null;

    // VER
    updateFileRest(req.params.id, req.user, permissionType, req.body).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(err.status).json({ message: err.message })
    })

})

export { router }
export default router
