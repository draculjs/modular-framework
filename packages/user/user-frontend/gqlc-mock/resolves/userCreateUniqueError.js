const r = {
    "errors": [{
        "message": "User validation failed: username: lincarnato ya existe. username debe ser unico., email: lucian.incarnato@gmail.com ya existe. email debe ser unico.",
        "locations": [{"line": 2, "column": 3}],
        "path": ["createUser"],
        "extensions": {
            "inputErrors": {
                "username": {
                    "properties": {
                        "message": "validation.unique",
                        "type": "unique",
                        "path": "username",
                        "value": "lincarnato"
                    }, "kind": "unique", "path": "username", "value": "lincarnato"
                },
                "email": {
                    "properties": {
                        "message": "validation.unique",
                        "type": "unique",
                        "path": "email",
                        "value": "lucian.incarnato@gmail.com"
                    }, "kind": "unique", "path": "email", "value": "lucian.incarnato@gmail.com"
                }
            },
            "code": "BAD_USER_INPUT",
            "exception": {
                "inputErrors": {
                    "username": {
                        "properties": {
                            "message": "lincarnato ya existe. username debe ser unico.",
                            "type": "unique",
                            "path": "username",
                            "value": "lincarnato"
                        }, "kind": "unique", "path": "username", "value": "lincarnato"
                    },
                    "email": {
                        "properties": {
                            "message": "lucian.incarnato@gmail.com ya existe. email debe ser unico.",
                            "type": "unique",
                            "path": "email",
                            "value": "lucian.incarnato@gmail.com"
                        }, "kind": "unique", "path": "email", "value": "lucian.incarnato@gmail.com"
                    }
                },
                "stacktrace": ["UserInputError: User validation failed: username: lincarnato ya existe. username debe ser unico., email: lucian.incarnato@gmail.com ya existe. email debe ser unico.", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/@ci-user-module/api/src/services/UserService.js:86:29", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/mongoose/lib/model.js:4887:16", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/mongoose/lib/helpers/promiseOrCallback.js:16:11", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/mongoose/lib/model.js:4910:21", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/mongoose/lib/model.js:495:16", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:246:48", "    at next (/home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:167:27)", "    at next (/home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:169:9)", "    at Kareem.execPost (/home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:217:3)", "    at _handleWrapError (/home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:245:21)", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:272:14", "    at _next (/home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:94:14)", "    at /home/cincarnato/code/core/scaffold/apps/api/node_modules/kareem/index.js:507:38", "    at processTicksAndRejections (internal/process/task_queues.js:79:11)"]
            }
        }
    }], "data": {"createUser": null}
}

export default r