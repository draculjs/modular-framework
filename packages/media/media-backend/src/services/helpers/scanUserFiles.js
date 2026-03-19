import fs from 'fs/promises';
import path from 'path';
import { DefaultLogger as winston } from '@dracul/logger-backend';

/**
 * @description Escanea el directorio de archivos y retorna lista de archivos.
 *              Escannea: {baseDir}/media/files
 * @async
 * @param {string|null} [baseDir=null] - Directorio base. Si null, usa MEDIA_ROOT_DIR o process.cwd()
 * @returns {Promise<Array<{relativePath: string, absolutePath: string, size: number}>>}
 */
export const scanUserFiles = async (baseDir = null) => {
    const cwd = baseDir || process.env.MEDIA_ROOT_DIR || process.cwd();
    const filesDir = path.join(cwd, 'media', 'files');
    
    winston.debug(`scanUserFiles: cwd=${cwd}, filesDir=${filesDir}`);
    
    const files = [];
    
    async function scan(dir) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await scan(fullPath);
                } else if (entry.isFile()) {
                    const stats = await fs.stat(fullPath);
                    files.push({
                        relativePath: path.relative(cwd, fullPath),
                        absolutePath: fullPath,
                        size: stats.size / (1024 * 1024)
                    });
                }
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                winston.debug(`scanUserFiles: Cannot scan ${dir}: ${err.message}`);
            }
        }
    }
    
    await scan(filesDir);
    
    winston.debug(`scanUserFiles: found ${files.length} files${files.length > 0 ? `, first: ${files[0].relativePath}` : ''}`);
    
    return files;
}

export default scanUserFiles;
