var assert = require('assert');
const {AssertionError} = require('assert');
const DayjsMixin = require('../src/mixins/DayjsMixin');
const Dayjs = require('../src/utils/Dayjs');

describe("DayjsMixin", () => {

    it('getDateFormat dayjs(1669334400000) => 2022-11-24', async () => {
        let result =DayjsMixin.default.computed.getDateFormat()(Dayjs(1669334400000))
        assert.strictEqual(result,'2022-11-24')
    })

    it('getDateTimeFormat dayjs(1669334400000) => 2022-11-24  21:00', async () => {
        let result =DayjsMixin.default.computed.getDateTimeFormat()(Dayjs(1669334400000))
        assert.strictEqual(result,'2022-11-24 21:00')
    })

    it('getDateTimeCustomFormat dayjs(1669334400000) => 2022-11-24  21:00:00', async () => {
        let result =DayjsMixin.default.computed.getDateTimeCustomFormat()(Dayjs(1669334400000))
        assert.strictEqual(result,'2022-11-24 21:00:00')
    })

    it('getDateFormat 1669334400000 => 2022-11-24', async () => {
        let result =DayjsMixin.default.computed.getDateFormat()(1669334400000)
        assert.strictEqual(result,'2022-11-24')
    })

    it('getDateFormat 139543127000 => 1974-06-03', async () => {
        let result =DayjsMixin.default.computed.getDateFormat()(139543127000)
        assert.strictEqual(result,'1974-06-03')
    })
    //129340800000
    it('getDateFormat 129340800000 => 1974-02-05', async () => {
        let result = DayjsMixin.default.computed.getDateFormat()(129340800000)
        assert.strictEqual(result,'1974-02-05')
    })
})
