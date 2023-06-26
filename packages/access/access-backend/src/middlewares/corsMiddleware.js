import { fetchEnabledDomains } from '../services/DomainServices'
import { DefaultLogger as winston } from '@dracul/logger-backend'

export const cors = async (req, res, next) => {
    try {
        if(req.headers.origin){
            const allowedOrigins = await fetchEnabledDomains()
            if(allowedOrigins.includes(req.headers.origin) || req.headers.origin === process.env.APP_API_URL || req.headers.origin === process.env.APP_WEB_URL){
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
                res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                return next()
            }
            return res.status(401).send("Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource.")
        }
        next()
    } catch (error) {
        winston.error(error.message)
    }
}