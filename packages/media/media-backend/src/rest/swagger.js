import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

function getSwaggerObject(){
    try {
        const yamlSwagger = load(readFileSync('./node_modules/@dracul/media-backend/src/rest/swagger.yaml', 'utf8'));
        const swaggerObject = {
            swaggerUiMiddleware: swaggerUi.serve,
            swaggerUiOptions: swaggerUi.setup(yamlSwagger)
        }
    
        return swaggerObject
    } catch (error) {
        console.log(`An error happened at the swagger.js file: '${error}'`)
    }
}

export const { swaggerUiMiddleware, swaggerUiOptions } = getSwaggerObject()