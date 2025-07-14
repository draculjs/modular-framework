
import { GraphQLScalarType } from 'graphql';
import dayjs from "dayjs";

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return dayjs(value).toDate(); // value from the client
        },
        serialize(value) {
            return dayjs(value).toISOString(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
};

