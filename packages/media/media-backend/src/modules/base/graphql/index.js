import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';


//TYPES
const typesArray = fileLoader(path.join(__dirname, './types'));
export const types =  mergeTypes(typesArray, { all: true });


//RESOLVERS
const resolversArray = fileLoader(path.join(__dirname, './resolvers'));
export const resolvers =  mergeResolvers(resolversArray);
