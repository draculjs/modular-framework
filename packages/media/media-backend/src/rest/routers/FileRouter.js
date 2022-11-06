import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import File from '../../models/FileModel'

import express from 'express';

const router = express.Router();
const multer = require('multer')
const upload = multer()
const streamifier = require('streamifier');
import { findFile, paginateFiles, updateFileRest } from "../../services/FileService";
import { fileUpload } from "../../services/UploadService";
import {
    FILE_SHOW_ALL,
    FILE_SHOW_OWN,
    FILE_CREATE, FILE_SHOW_PUBLIC
} from "../../permissions/File";

router.get('/file/:id', function (req, res) {

    if (!req.user) res.status(401).json({ message: "Not Authorized" })
    if (!req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)) res.status(403).json({ message: "Not Authorized" })

    let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL)
    let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN)
    let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)

    const { id } = req.params

    findFile(id, req.user.id, allFilesAllowed, ownFilesAllowed, publicAllowed).then(file => {
        if (file) {
            res.status(200).json(file);
        } else {
            res.status(404).json({ message: 'File not found' })
        }
    }).catch(err => {
        res.status(500).json({ message: err.message })
    })
});

router.get('/file', function (req, res) {

    if (!req.user) res.status(401).json({ message: "Not Authorized" })
    if (!req.rbac.isAllowed(req.user.id, FILE_SHOW_ALL) && !req.rbac.isAllowed(req.user.id, FILE_SHOW_OWN)) res.status(403).json({ message: "Not Authorized" })

    let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL)
    let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN)
    let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)

    const { pageNumber, itemsPerPage, search, orderBy, orderDesc } = req.query

    paginateFiles({ pageNumber, itemsPerPage, search, orderBy, orderDesc }, req.user.id, allFilesAllowed, ownFilesAllowed, publicAllowed).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'File not found' })
        }
    }).catch(err => {
        res.status(500).json({ message: err.message })
    })
});

router.post('/file', upload.single('file'), async function (req, res) {
    if (!req.user) res.status(401).json({ message: "Not Authorized" })
    if (!req.rbac.isAllowed(req.user.id, FILE_CREATE)) res.status(403).json({ message: "Not Authorized" })

    const { expirationTime, isPublic } = req.body;

    let file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        createReadStream: () => streamifier.createReadStream(req.file.buffer),
        encoding: req.file.encoding
    }

    fileUpload(req.user, file, expirationTime, isPublic).then(result => {
        res.status(201).json(result)
    }).catch(err => {
        res.status(409).json({ message: err.message })
    })

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
