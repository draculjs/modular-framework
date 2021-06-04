var assert = require('assert');
const {AssertionError} = require('assert');
const DayjsMixin = require('../src/mixins/DayjsMixin');
const Dayjs = require('../src/utils/Dayjs');

describe("DayjsMixin", () => {

    //String
    it('getDateFormat 2022-11-24 => 2022-11-24', async () => {
        let result =DayjsMixin.default.computed.getDateFormat()('2022-11-24')
        assert.strictEqual(result,'2022-11-24')
    })

    it('getTimeFormat 23:59 => 23:59', async () => {
        let result =DayjsMixin.default.computed.getTimeFormat()('23:59')
        assert.strictEqual(result,'23:59')
    })


    it('getDateTimeFormat 2022-11-24 21:00 => 2022-11-24  21:00', async () => {
        let result =DayjsMixin.default.computed.getDateTimeFormat()('2022-11-24 21:00')
        assert.strictEqual(result,'2022-11-24 21:00')
    })

    it('getDateTimeCustomFormat 2022-11-24 21:00:00 => 2022-11-24  21:00:00', async () => {
        let result =DayjsMixin.default.computed.getDateTimeCustomFormat()('2022-11-24 21:00:00')
        assert.strictEqual(result,'2022-11-24 21:00:00')
    })

    //Object
    it('getDateFormat dayjs(1669334400000) => 2022-11-24', async () => {
        let result =DayjsMixin.default.computed.getDateFormat()(Dayjs(1669334400000))
        assert.strictEqual(result,'2022-11-24')
    })

    it('getTimeFormat Dayjs(1669334400000) => 21:00', async () => {
        let result =DayjsMixin.default.computed.getTimeFormat()(Dayjs(1669334400000))
        assert.strictEqual(result,'21:00')
    })

    it('getDateTimeFormat dayjs(1669334400000) => 2022-11-24  21:00', async () => {
        let result =DayjsMixin.default.computed.getDateTimeFormat()(Dayjs(1669334400000))
        assert.strictEqual(result,'2022-11-24 21:00')
    })

    it('getDateTimeCustomFormat dayjs(1669334400000) => 2022-11-24  21:00:00', async () => {
        let result =DayjsMixin.default.computed.getDateTimeCustomFormat()(Dayjs(1669334400000))
        assert.strictEqual(result,'2022-11-24 21:00:00')
    })

    //Timestamp
    it('getDateFormat 1669334400000 => 2022-11-24', async () => {
        let result =DayjsMixin.default.computed.getDateFormat()(1669334400000)
        assert.strictEqual(result,'2022-11-24')
    })

    it('getDateFormat 139543127000 => 1974-06-03', async () => {
        let result =DayjsMixin.default.computed.getDateFormat()(139543127000)
        assert.strictEqual(result,'1974-06-03')
    })

    it('getDateFormat 129340800000 => 1974-02-05', async () => {
        let result = DayjsMixin.default.computed.getDateFormat()(129340800000)
        assert.strictEqual(result,'1974-02-05')
    })
})
