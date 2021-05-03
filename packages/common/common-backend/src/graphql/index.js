
import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';


//TYPES
const typesArray = fileLoader(path.join(__dirname, './types'));
export const types =  mergeTypes(typesArray, { all: true });



