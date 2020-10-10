import RequestLogger from "../loggers/RequestLogger";

function sanatizeIp(ip) {
    return ip.replace("::ffff:", "")
}

function RequestMiddleware(req, res, next) {

    if (process.env.LOG_REQUEST === "ON") {

        let info = {};
        info.ip = sanatizeIp(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
        info.method = req.method
        info.user = req.user ? req.user.username ? req.user.username : 'anonymous' : 'anonymous'
        info.dst = req.hostname + (req.port || '') + (req.originalUrl || '')
        info.operation = req.body ? req.body.operationName ? req.body.operationName : "" : ""

        let message = `${info.method} ${info.dst} ${info.ip} ${info.user} ${info.operation}`

        RequestLogger.info(message)

    }

    next()
}

export default RequestMiddleware