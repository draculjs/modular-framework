import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { DefaultLogger as winston } from '@dracul/logger-backend';
import path from 'path';

function getSwaggerObject() {
    try {
        const swaggerPath = path.join(__dirname, 'swagger.yaml');
        winston.debug(`swagger.getSwaggerObject: loading swagger from '${swaggerPath}'`);
        
        const yamlSwagger = load(readFileSync(swaggerPath, 'utf8'));
        
        winston.info(`swagger.getSwaggerObject: successfully loaded swagger documentation`);
        
        const swaggerObject = {
            swaggerUiMiddleware: swaggerUi.serve,
            swaggerUiOptions: swaggerUi.setup(yamlSwagger)
        }

        return swaggerObject
    } catch (error) {
        winston.error(`swagger.getSwaggerObject error: ${error.message}`, { error: error.stack });
        return null;
    }
}

const swaggerObject = getSwaggerObject();

export const swaggerUiMiddleware = swaggerObject?.swaggerUiMiddleware || null;
export const swaggerUiOptions = swaggerObject?.swaggerUiOptions || null;
