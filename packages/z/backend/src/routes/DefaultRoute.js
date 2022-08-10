import express from 'express';
import path from "path";
export let defaultRoute = express.Router();

defaultRoute.use('/', express.static('web', {index: "index.html"}));
defaultRoute.use('*',function (request, response) {
    response.sendFile(path.resolve( path.join(__dirname, '..', 'web/index.html') ));
});


export default defaultRoute
