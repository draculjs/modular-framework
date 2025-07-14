import { DefaultLogger } from '@dracul/logger-backend';
import fs from 'fs';
import os from 'os';
import path from 'path';


export default function tempDir(name){
    try {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), name))
        return {
            dir: tmpDir,
            getDir(){
                return this.dir
            },
            purge(){
                fs.rmdirSync(this.dir, { recursive: true })
            }
        }
    } catch (error) {
        DefaultLogger.error(`An error happened at tempDir: ${error}`)
    }
}

