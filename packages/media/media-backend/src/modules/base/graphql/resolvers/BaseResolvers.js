export default {
    Query: {
        ping: (_, { id }) => {
            return Promise.resolve({ status: true })
        },
        fetchMaxFileSize: (_, { }) => {
            return Promise.resolve({ maxFileSize: process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES })
        },
    }
}