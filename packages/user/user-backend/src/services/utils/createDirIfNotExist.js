import fs from 'fs';
import path from 'path';

export default function createDirIfNotExist(dst) {

    let dir = path.dirname(dst)

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }


}