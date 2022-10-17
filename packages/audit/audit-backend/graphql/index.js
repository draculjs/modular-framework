
const path = require('path');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');


//TYPES
const typesArray = fileLoader(path.join(__dirname, './types'));
const types =  mergeTypes(typesArray, { all: true });


//RESOLVERS
const resolversArray = fileLoader(path.join(__dirname, './resolvers'));
const resolvers =  mergeResolvers(resolversArray);


module.exports = {
    types,
    resolvers
}