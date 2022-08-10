const randomString = require('../../src/helpers/randomString')

const requiredRule = v => (!!v || v === 0) || 'required'

describe("randomString", () => {

    test('v == null', async () => {
        let v = null
        let isRequired = requiredRule(v)
        expect(isRequired).toBe('required')
    })

    test('v == 0', async () => {
        let v = 0
        let isRequired = requiredRule(v)
        expect(isRequired).toBe(true)
    })

    }
)
