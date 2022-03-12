import {
    ForbiddenError,
    AuthenticationError,
    UserInputError,
    ValidationError,
    ApolloError
} from "apollo-server-errors";

import CustomError from "../../errors/CustomError";
import BaseError from './../../model/BaseErrorModel'

export default {
    Query: {
        getNotAuthorized: (_) => {
            throw new ForbiddenError("Custom Message ForbiddenError")
        },
        getAuthenticationError: (_,{},{user}) => {
                throw new AuthenticationError("Custom Message AuthenticationError")
        },
        getUserInputError: (_) => {
            const baseError = new BaseError({
                name: 'abc123',
                age: 66,
                color: 'h'
            });
            let validationErrors = baseError.validateSync();
            throw new UserInputError("Custom Message UserInputError", {inputErrors: validationErrors.errors})
        },
        getValidationError: (_) => {
            throw new ValidationError("Custom Message ValidationError")
        },
        getApolloError: (_) => {
            throw new ApolloError("Custom Message ApolloError")
        },
        getCustomError: (_) => {
            throw new CustomError("Custom Message CustomError")
        },
        getTimeout: (_) => {
           return new Promise((resolve, reject) => {
               setTimeout(()=> {resolve("TIMEOUT")}, 600000)
           })
        },
    }
}
