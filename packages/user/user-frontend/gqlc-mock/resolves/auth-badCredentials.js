const resolve = {
    "errors": [
        {
            "message": "BadCredentials",
            "locations": [{"line": 2, "column": 3}],
            "path": ["auth"],
            "extensions": {
                "code": "UNAUTHENTICATED",
                "exception": {
                    "stacktrace": [
                        "AuthenticationError: BadCredentials",
                        "    at /app/dist/modules/security/graphql/resolvers/UserResolvers.js:64:18",
                        "    at runMicrotasks (<anonymous>)",
                        "    at processTicksAndRejections (internal/process/task_queues.js:97:5)"
                    ]
                }
            }
        }
    ],
    "data": {"auth": null}
}

export default resolve