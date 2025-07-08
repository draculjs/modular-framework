const notAuthenticatedErrorMessage = "You are not authenticated"
const notAuthorizedErrorMessage = "You are not authorized to perform this action"

/**
 * Middleware that checks if the request has a user authenticated.
 * If not, it sends a 401 Unauthorized response and throws an error.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
export function requireAuthentication(req, res, next){
    if (!req.user) {
        res.status(401).send(notAuthenticatedErrorMessage)
        return;

    }
    next()
}

/**
 * Middleware that checks if the user is authorized to perform all specified actions.
 * If not, it sends a 403 Forbidden response and throws an error.
 * @param {string[]} actions - An array of action names to check authorization for.
 * @returns {import('express').RequestHandler} Express middleware function.
 */
export function requireAuthorization (actions, authorizedForAll = false){
    return (req, res, next) => {
        const isAuthorized = (authorizedForAll) ? 
            actions.every(action => req.rbac.isAllowed(req.user.id, action)) :
            actions.some(action => req.rbac.isAllowed(req.user.id, action))

        if (!isAuthorized) {
            res.status(403).send(notAuthorizedErrorMessage)
            return;
        }

        next()
    }
}