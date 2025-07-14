import {updateSession} from "../services/SessionService.js";

const sessionMiddleware = (req, res, next) => {
    try {
        if (req && req.user) {
            updateSession(req.user)
        }
        next()
    } catch (e) {
        next(e)
    }
}

export default sessionMiddleware
