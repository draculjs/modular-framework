import express from 'express';
import { fetchUserStorage } from '../../services/UserStorageService'
import { DefaultLogger as winston } from '@dracul/logger-backend'

const usersStorageRouter = express.Router();

usersStorageRouter.get('/usersStorage', async function (req, res) {
    if (!req.user) res.status(401).json({ message: "Not Authorized" })

    let usersStorage = (await fetchUserStorage())

    if (usersStorage) {
        res.send(usersStorage).status(200)
    } else {
        res.send(false).status(400)
    }
})

module.exports = usersStorageRouter;
export default usersStorageRouter;
