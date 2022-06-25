const fs = require('fs');
const os = require('os');
const path = require('path');


export const tempDir = (name) => {
    let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), name));
    return {
        dir: tmpDir,
        getDir(){
            return this.dir
        },
        purge(){
            fs.rmdirSync(this.dir, { recursive: true });
        }
    }
}

export default tempDir
