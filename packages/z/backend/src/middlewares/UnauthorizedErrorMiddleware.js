import {DefaultLogger} from "@dracul/logger-backend";

export const unauthorizedErrorMiddleware =  (err, req, res, next) => {
    if(err && err.name === 'UnauthorizedError'){
        DefaultLogger.warn(err.message)
    }
    next()
}

export default unauthorizedErrorMiddleware
