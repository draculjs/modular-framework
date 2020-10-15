const fs = require('fs');
const MockExpressRequest = require('mock-express-request');
const FormData = require('form-data');

function uploadMultipartSimulator(){
    const form = new FormData();

    form.append('my_file',
        fs.createReadStream(path.join(__dirname, 'fixtures', 'file-upload-test.txt'))
    );

    const request = new MockExpressRequest({
        method: 'POST',
        host: 'localhost',
        url: '/upload',
        headers: form.getHeaders()
    });

    return request
}
