import express from 'express';
export let mediaRoute = express.Router();

//STATIC FILES
mediaRoute.use('/media/avatar', express.static('media/avatar'));
mediaRoute.use('/media/logo', express.static('media/logo'));
mediaRoute.use('/media/export', express.static('media/export'));
mediaRoute.use('/media/files', express.static('media/files'));

export default mediaRoute
