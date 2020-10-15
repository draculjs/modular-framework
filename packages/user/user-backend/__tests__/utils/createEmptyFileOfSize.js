const fs = require('fs');

const createEmptyFileOfSize = (fileName, size) => {
    return new Promise((resolve, reject) => {
        let fh = fs.openSync(fileName, 'w');
        fs.writeSync(fh, 'ok', Math.max(0, size - 2));
        fs.closeSync(fh);
        resolve(true);
    });
};

module.exports = createEmptyFileOfSize