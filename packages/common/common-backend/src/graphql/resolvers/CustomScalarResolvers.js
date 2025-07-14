import {UserInputError} from 'apollo-server-errors'
import GraphQLJSON from 'graphql-type-json';
import { GraphQLScalarType } from "graphql";


export default {
    JSON: GraphQLJSON,
    Any: new GraphQLScalarType({
        name: "Any",
        description: "Literally anything",
        serialize(value) {
            return value;
        },
        parseValue(value) {
            return value;
        },
        parseLiteral(ast) {
            return ast.value;
        }
    }),
    ArrayString: new GraphQLScalarType({
        name: "ArrayString",
        description: "String or Array String",
        serialize(value) {
            return value;
        },
        parseValue(value) {
            return value;
        },
        parseLiteral(ast) {

            if(!Array.isArray(ast.value) && typeof ast.value != 'string'){
                throw new UserInputError('Provided value is not a String or Array of String');
            }

            return ast.value;
        }
    })
}
