import GqlErrorLogger from "../loggers/GqlErrorLogger";

function GqlErrorLog(requestContext) {
    try{
        if (process.env.LOG_GQL_ERRORS == "ON") {

            let user = requestContext.context.user ? requestContext.context.user.username ? requestContext.context.user.username : "anonymous" : "anonymous"
            let operation = requestContext.operation ? requestContext.operation.operation : ""
            requestContext.errors.forEach(error => {
                let path = (error.path && Array.isArray(error.path) && error.path[0]) ? error.path[0] : ""
                let message = `${operation}:${path} by:${user}`
                GqlErrorLogger.error(message, error)
            })
        }
    }catch (e){
        console.error(e)
    }


}

export default GqlErrorLog
