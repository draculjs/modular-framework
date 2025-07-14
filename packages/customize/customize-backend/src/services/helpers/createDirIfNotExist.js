import path from 'path';
import fs from 'fs';

export const createDirIfNotExist = function (dst) {
    let dir = path.dirname(dst)

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}

export default createDirIfNotExist