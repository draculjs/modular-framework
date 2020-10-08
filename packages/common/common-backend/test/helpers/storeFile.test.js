const storeFile = require('../../src/helpers/storeFile')
const stream = require('stream');
const fs = require('fs');

describe("storeFile", () => {

        test('Happy path', () => {

            let file = fs.createReadStream('./test/input/user.png')

            return expect(storeFile(file, './test/output/user.png'))
                .resolves
                .toBe(true);

        })

        test('Not a Redeable Stream', async () => {

            let file = fs.createReadStream('./test/input/user.png')

            expect(() => storeFile('something else', './test/output/user.png'))
                .toThrow("A redeable stream is required");

        })


    }
)