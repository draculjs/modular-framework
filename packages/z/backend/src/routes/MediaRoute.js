    import express from 'express';
    export let mediaRoute = express.Router();
    import { checkFilePrivacy } from "@dracul/media-backend"

    const cacheConfigObject = {
        maxAge: '1d',
        etag: true
    }

    const staticFilesConfig = {
        ...cacheConfigObject,
        dotfiles: 'allow'
    }

    mediaRoute.use('/media/avatar', express.static('media/avatar'));
    mediaRoute.use('/media/logo', express.static('media/logo'));
    mediaRoute.use('/media/export', express.static('media/export'));
    mediaRoute.use('/media/files', checkFilePrivacy,  express.static('media/files', staticFilesConfig))

    export default mediaRoute
