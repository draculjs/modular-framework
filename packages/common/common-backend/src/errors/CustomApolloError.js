import {ApolloError} from "apollo-server-errors";

class CustomApolloError extends ApolloError{

    constructor(message, code = 'CUSTOM_ERROR') {
        super(message, code);
    }
}

export default CustomApolloError
