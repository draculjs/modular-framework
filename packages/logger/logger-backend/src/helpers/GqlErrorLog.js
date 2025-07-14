import GqlErrorLogger from "../loggers/GqlErrorLogger";

function GqlErrorLog(requestContext) {
    try {
        if (process.env.LOG_GQL_ERRORS == "ON" && requestContext.errors) {
            // Manejo seguro del contexto
            const context = requestContext.contextValue || {};
            const user = context.user || context.req?.user || {};
            
            const username = user.username ? user.username : "anonymous";
            const operation = requestContext.operation?.operation || "unknown_operation";
            
            requestContext.errors.forEach(error => {
                const path = Array.isArray(error.path) && error.path[0] ? error.path[0] : "";
                const message = `${operation}:${path} by:${username}`;
                
                GqlErrorLogger.error(message, error);
            });
        }
    } catch (e) {
        console.error("Error in GqlErrorLog:", e);
    }
}

export default GqlErrorLog;