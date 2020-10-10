# Dracul Logger Module
Dracul logger provide several winston loggers configurations and factories ready to use


### ENV

```$xslt
### LOG ENVIRONMENT VARIABLES

# LOG LEVEL: error, warning, info, debug
LOG_LEVEL=debug

# REQUEST
LOG_REQUEST=ON
LOG_RESPONSE_TIME=ON
LOG_GQL_ERRORS=ON

# LOG TRANSPORTS
LOG_TRANSPORT_CONSOLE=ON
LOG_TRANSPORT_COMBINED=ON
LOG_TRANSPORT_ERROR=ON
LOG_TRANSPORT_ACCESS=ON
LOG_TRANSPORT_GQL_ERROR=ON
LOG_TRANSPORT_GQL_RESPONSE=ON

# LOG COLORIZE: ON / OFF
LOG_COLORIZE=ON

# Max log file size in bytes. Ex: 10000000 Bytes == 1 MegaByte
LOG_FILE_MAX_SIZE=10000000

# Number of max files
LOG_FILE_MAX_FILES=3

# LOG MODES: TEXT / JSON
LOG_MODE=TEXT
```


## Default logger

Setup a default logger with 3 transports **console**, **comined.log** and **error.log**

## Express middleware Request Logger

Setup an express middleware for log requests

####Request items in log

- Method
- Path
- IP
- User
- Graphql Operation name  (if is present) 
