import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create error response middleware
const errorResponse = (req, res, next) => {
  res.status(500).send('Swagger documentation is unavailable due to a configuration error');
};

// Initialize with safe defaults
let swaggerUiMiddleware = errorResponse;
let swaggerUiOptions = errorResponse;

try {
  const swaggerPath = path.join(__dirname, 'swagger.yaml');
  const yamlSwagger = load(readFileSync(swaggerPath, 'utf8'));
  
  swaggerUiMiddleware = swaggerUi.serve;
  swaggerUiOptions = swaggerUi.setup(yamlSwagger);
} catch (error) {
  console.error(`Swagger configuration error: ${error.message}`);
}

export { swaggerUiMiddleware, swaggerUiOptions };