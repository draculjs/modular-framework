import { DefaultLogger } from '@dracul/logger-backend';
import fs from 'fs';
import path from 'path';
export default function createDirIfNotExist(directoryPath){
    try {
        const directoryName = path.dirname(directoryPath)
        if (!fs.existsSync(directoryName)) fs.mkdirSync(directoryName, { recursive: true })
    } catch (error) {
        DefaultLogger(`An error happened at the createDirIfNotExist function: ${error}`)
    }
}
