# ci common module
Common utils

## Helpers
- create dir if not exist
- random number
- random string
- store file

## Logger

### setup a winston default logger
A kind of factory for winston default logger that use environment variables for flexible configuration

#### Environment variables:
```$xslt
#LOG LEVEL OPTIONS: error, warning, info, debug
LOG_LEVEL=debug

#Enable Log File: ON / OFF
LOG_FILE=ON

#Enable colorize console logs: ON / OFF
LOG_COLORIZE=ON

# Max log file size in bytes. Ex: 10000000 Bytes == 1 MegaByte
LOG_FILE_MAX_SIZE=10000000

# Number of max files
LOG_FILE_MAX_FILES=3

# Enable JSON format: ON / OFF
LOG_JSON=OFF
```
