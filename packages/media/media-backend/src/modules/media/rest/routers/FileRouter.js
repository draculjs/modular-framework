import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import express from 'express';
var router = express.Router();
const multer = require('multer')
const upload = multer()
const streamifier = require('streamifier');
import {findFile, paginateFiles} from "../../services/FileService";
import {fileUpload} from "../../services/UploadService";
import {FILE_CREATE, FILE_SHOW} from "../../permissions/File";


router.get('/file/:id', function (req, res) {

    if (!req.user) res.status(403).send("Not Authorized")
    if (!req.rbac.isAllowed(req.user.id, FILE_SHOW)) res.status(403).send("Not Authorized")

    let id = req.params.id
    findFile(id).then(file => {
        res.json(file);
    }).catch(err => {
        res.status(500).send(err.message)
    })
});

router.get('/file', function (req, res) {

    if (!req.user) res.status(403).send("Not Authorized")
    if (!req.rbac.isAllowed(req.user.id, FILE_SHOW)) res.status(403).send("Not Authorized")


    let pageNumber = req.query.pageNumber
    let itemsPerPage = req.query.itemsPerPage
    let search = req.query.search
    let orderBy = req.query.orderBy
    let orderDesc = req.query.orderDesc
    paginateFiles(pageNumber, itemsPerPage, search, orderBy, orderDesc).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).send(err.message)
    })
});


router.post('/file', upload.single('file'), function (req, res) {
    if (!req.user) res.status(403).send("Not Authorized")
    if (!req.rbac.isAllowed(req.user.id, FILE_CREATE)) res.status(403).send("Not Authorized")



    let file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        createReadStream: () => streamifier.createReadStream(req.file.buffer),
        encoding: req.file.encoding
    }

    fileUpload(req.user, file).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.message)
    })

})

export {router}
export default router