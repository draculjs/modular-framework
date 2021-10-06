import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import express from 'express';

const router = express.Router();
const multer = require('multer')
const upload = multer()
const streamifier = require('streamifier');
import { findFile, paginateFiles } from "../../services/FileService";
import { fileUpload } from "../../services/UploadService";
import { FILE_CREATE, FILE_SHOW } from "../../permissions/File";

router.get('/file/:id', function (req, res) {

    if (!req.user) res.status(401).json({message: "Not Authorized"})
    if (!req.rbac.isAllowed(req.user.id, FILE_SHOW)) res.status(403).json({message: "Not Authorized"})

    const {id} = req.params

    findFile(id).then(file => {
        res.status(200).json(file);
    }).catch(err => {
        res.status(500).json({message: err.message})
    })
});

router.get('/file', function (req, res) {

    if (!req.user) return res.status(401).json({message: "Not Authorized"})
    if (!req.rbac.isAllowed(req.user.id, FILE_SHOW)) return res.status(403).json({message: "Not Authorized"})

    const {pageNumber, itemsPerPage, search, orderBy, orderDesc} = req.query

    paginateFiles(pageNumber, itemsPerPage, search, orderBy, orderDesc).then(result => {
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(500).json({message: err.message})
    })
});

router.post('/file', upload.single('file'), function (req, res) {
    if (!req.user) res.status(401).json({message: "Not Authorized"})
    if (!req.rbac.isAllowed(req.user.id, FILE_CREATE)) res.status(403).json({message: "Not Authorized"})

    let file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        createReadStream: () => streamifier.createReadStream(req.file.buffer),
        encoding: req.file.encoding
    }

    fileUpload(req.user, file).then(result => {
        res.status(201).json(result)
    }).catch(err => {
        res.status(500).json({message: err.message})
    })

})

export { router }
export default router