import {ApolloError} from "apollo-server-errors"


class CustomError extends ApolloError {
    constructor(message, properties) {
        super(message, 'CUSTOM_ERROR', properties);

        Object.defineProperty(this, 'name', {value: 'CustomError'});
    }
}


export default CustomError
