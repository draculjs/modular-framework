import {updateSession} from "../services/SessionService";

const sessionMiddleware = (req, res, next) => {
    if (req.user) updateSession(req.user)
    next()
}

export default sessionMiddleware