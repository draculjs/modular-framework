import path from 'path';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'

//TYPES
const typesArray = loadFilesSync(path.join(__dirname, './types'));
export const types =  mergeTypeDefs(typesArray, { all: true });


//RESOLVERS
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));
export const resolvers =  mergeResolvers(resolversArray);
