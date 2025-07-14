import {ApolloError} from "apollo-server-errors"

export default class CustomApolloError extends ApolloError{

    constructor(message, code = 'CUSTOM_ERROR') {
        super(message, code);
    }
}
