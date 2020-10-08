const randomString = require('../../src/helpers/randomString')


describe("randomString", () => {

    test('default lenght', async () => {

        let rs = randomString()

        expect(rs.length).toBe(4)

    })

    test('Custom lenght', async () => {

        let rs = randomString(5)

        expect(rs.length).toBe(5)

    })



    }
)