import path from 'path';
import fs from 'fs';

export default function createDirIfNotExist(dst){
    const directoryPath = path.dirname(dst)
    if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath, { recursive: true })
}
