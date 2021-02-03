import GqlResponseLogger from "../loggers/GqlResponseLogger";

const unwrap = (s) => s.replace(
    /\n/g, ''
);

function GqlResponseLog(requestContext) {
    try {
        if (process.env.LOG_GRAPHQL_RESPONSE == "ON") {

            let info = {};
            info.user = requestContext.context.user ? requestContext.context.user.username ? requestContext.context.user.username : "anonymous" : "anonymous"
            info.type = requestContext.operation ? requestContext.operation.operation ? requestContext.operation.operation.toUpperCase() : "" : ""
            info.operation = requestContext.operationName || ""
            info.query = unwrap(requestContext.request.query) || ""
            info.variables = JSON.stringify(requestContext.request.variables) || ""
            info.resp = JSON.stringify(requestContext.response.data) || ""

            let message = `GqlResp ${info.type} op:${info.operation} user:${info.user} qry: ${info.query} vars: ${info.variables} resp: ${info.resp} \n`

            GqlResponseLogger.info(message)
        }
    } catch (e) {
        console.error(e)
    }

}

export default GqlResponseLog
