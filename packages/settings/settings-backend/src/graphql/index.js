import path from 'path';
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')

//TYPES
const typesArray = loadFilesSync(path.join(__dirname, './types'), { extensions: ['graphql'] })
export const types =  mergeTypeDefs(typesArray);

//RESOLVERS
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'))
export const resolvers =  mergeResolvers(resolversArray);


