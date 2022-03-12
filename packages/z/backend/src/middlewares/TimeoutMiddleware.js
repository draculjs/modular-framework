function getTimeout(seconds){
 return seconds * 1000
}
const TimeoutMiddleware = (req, res, next) => {
    // Set the timeout for all HTTP requests
    req.setTimeout(getTimeout(10), () => {
        let err = new Error('Request Timeout')
        err.status = 408
        next(err)
    })

    // Set the server response timeout for all HTTP requests
    res.setTimeout(getTimeout(10), () => {
        let err = new Error('Response Timeout')
        err.status = 503
        next(err)
    })

    next()
}

export {
    TimeoutMiddleware
}

export default TimeoutMiddleware
