process.env.MONGO_URL = 'mongodb://127.0.0.1:27017/jest_media';
process.env.MEDIA_DEFAULT_CAPACITY = '1024';
process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES = '100';
process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS = '30';
process.env.MEDIA_CLEANUP_CONCURRENCY = '5';
process.env.MEDIA_FILE_CLEANUP_ENABLED = 'true';
process.env.JWT_SECRET = 'test-secret-for-jwt';
process.env.LDAP_AUTH = 'false';
