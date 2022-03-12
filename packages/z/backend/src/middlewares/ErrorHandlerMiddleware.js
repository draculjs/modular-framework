import http from 'http'

export const ErrorHandlerMiddleware = (err, req, res, next) => {
    const status = (err.status && validateStatusCode(err.status)) ? err.status : 500;
    res.status(status);
    res.send(err.message);
}

function validateStatusCode(statusCode){
    return http.STATUS_CODES.hasOwnProperty(statusCode)
}


export default ErrorHandlerMiddleware
