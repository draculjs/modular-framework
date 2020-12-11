const resolve = {
    "errors": [
        {
            "message": "MAX_FILE_SIZE_EXCEEDED",
            "locations": [{"line": 2, "column": 3}],
            "path": ["logoUpload"],
            "extensions":
                {
                    "code": "INTERNAL_SERVER_ERROR",
                    "exception":
                        {
                            "stacktrace":
                                ["Error: Error storeFS detail: MAX_FILE_SIZE_EXCEEDED",
                                    "    at /home/cincarnato/code/dracul-scaffold/apps/api/node_modules/@dracul/user-backend/lib/services/ProfileService.js:155:16",
                                    "    at runMicrotasks (<anonymous>)", "    at processTicksAndRejections (internal/process/task_queues.js:97:5)"]
                        }
                }
        }
    ],
    "data": null
}
export default resolve