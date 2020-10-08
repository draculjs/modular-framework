const fs = require('fs');
const path = require('path');

const createDirIfNotExist = function(dst){
    let dir = path.dirname(dst)

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}

module.exports.createDirIfNotExist = createDirIfNotExist
module.exports =  createDirIfNotExist