import { fetchEnabledDomains } from '../services/DomainServices'
import { DefaultLogger as winston } from '@dracul/logger-backend'

export const cors = async (req, res, next) => {
    try {
        winston.debug(`[CORS] req.headers.origin: '${req.headers.origin}'`)
        winston.debug(`[CORS] process.env.APP_WEB_URL: '${process.env.APP_WEB_URL}'`)
        winston.debug(`[CORS] process.env.APP_API_URL: '${process.env.APP_API_URL}'`)
        winston.debug(`[CORS] req.headers.origin === process.env.APP_WEB_URL: ${req.headers.origin === process.env.APP_WEB_URL}`)
        winston.debug(`[CORS] req.headers.origin === process.env.APP_API_URL: ${req.headers.origin === process.env.APP_API_URL}`)
        
        if(req.headers.origin){
            const allowedOrigins = await fetchEnabledDomains()
            const requestOriginIsAllowed = allowedOrigins.includes(req.headers.origin)
            const requestOriginIsApiUrl = req.headers.origin === process.env.APP_API_URL
            const requestOriginIsWebUrl = req.headers.origin === process.env.APP_WEB_URL

            if ( requestOriginIsAllowed || requestOriginIsApiUrl || requestOriginIsWebUrl){
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

                return next()
            }

            return res.status(401).send("Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource.")
        }
        next()
    } catch (error) {
        winston.error(error.message)
    }
}