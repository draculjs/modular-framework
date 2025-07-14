import path from 'path';
import { fileURLToPath } from 'url';
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TYPES
const typesArray = loadFilesSync(path.join(__dirname, './types'), { 
    extensions: ['graphql'] 
});
export const types = mergeTypeDefs(typesArray);

// RESOLVERS
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));
export const resolvers = mergeResolvers(resolversArray);