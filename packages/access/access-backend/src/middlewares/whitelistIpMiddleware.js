import { fetchEnabledIp } from '../services/IpServices'
import { DefaultLogger as winston } from '@dracul/logger-backend'

export const whitelistIp = async (req, res, next) => {
    try {
        if(!req.headers.origin){
            const clientIp = req.ip
            console.log('client ip : ', clientIp)
            const whitelist = await fetchEnabledIp()
            console.log('whitelist: ', whitelist)
            //server ip
            if(clientIp === '::ffff:127.0.0.1' || clientIp === '::1') return next()
            if(whitelist.includes(clientIp)) next()
            else return res.status(403).send('Access Denied')
        }
        next()
    } catch (error) {
        winston.error('Server error in whitelis ip Middleware', error.message)
        res.status(500).send('Server error')
    }
}