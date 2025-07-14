import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultRoute = express.Router();

// Serve static files from 'web' directory
defaultRoute.use('/', express.static('web', { index: 'index.html' }));

// Handle all other routes with a regular expression
defaultRoute.get(/.*/, (request, response) => {
    response.sendFile(path.resolve(path.join(__dirname, '..', 'web/index.html')));
});

export default defaultRoute;