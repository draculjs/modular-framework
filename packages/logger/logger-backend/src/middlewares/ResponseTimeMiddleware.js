import RequestLogger from "../loggers/RequestLogger";

function sanatizeIp(ip) {
    return ip.replace("::ffff:", "")
}

function ResponseTimeMiddleware(req, res, next){

    if (process.env.LOG_RESPONSE_TIME === "ON") {

        let start = new Date;

        let info = {};
        info.ip = sanatizeIp(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
        info.method = req.method
        info.user = req.user ? req.user.username ? req.user.username : 'anonymous' : 'anonymous'
        info.dst = req.hostname + (req.port || '') + (req.originalUrl || '')
        info.operation = req.body ? req.body.operationName ? req.body.operationName : "" : ""

        res.on('finish', function(){
            let duration = new Date - start;
            info.responseTime = duration + "ms"
            info.statusCode = res.statusCode

            let message = `${info.method} ${info.dst} ${info.ip} ${info.user} ${info.operation} response: ${info.statusCode} ${info.responseTime}`

            RequestLogger.info(message)
        });
    }

    next()
}

export default ResponseTimeMiddleware