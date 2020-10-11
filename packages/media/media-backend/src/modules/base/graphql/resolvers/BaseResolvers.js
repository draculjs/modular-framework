export default {
    Query: {
        ping: (_, {id}) => {
            return Promise.resolve({status: true})
        },
    }
}