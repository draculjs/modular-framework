import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import path from 'path';
function getSwaggerObject(){
    try {
        const swaggerPath = path.join(__dirname,'swagger.yaml')
        const yamlSwagger = load(readFileSync(swaggerPath, 'utf8'));
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
