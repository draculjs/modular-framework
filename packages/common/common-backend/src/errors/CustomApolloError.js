const {ApolloError} = require("apollo-server-errors")

class CustomApolloError extends ApolloError{

    constructor(message, code = 'CUSTOM_ERROR') {
        super(message, code);
    }
}

module.exports = CustomApolloError
