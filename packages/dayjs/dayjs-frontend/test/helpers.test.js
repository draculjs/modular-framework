const Dayjs = require('../src/utils/Dayjs')
import setTimeToDatetimeHelper from "../src/helpers/setTimeToDatetimeHelper"
import setDateToDatetimeHelper from "../src/helpers/setDateToDatetimeHelper";
var assert = require('assert');
const {AssertionError} = require('assert');


describe("Helpers", () => {


    it('setTimeToDatetimeHelper should throw error if date is not dayjs instance', async () => {

        let date = '2020-01-01'
        assert.throws(() => setTimeToDatetimeHelper(date,"03:25"),Error,'Date is not a Dayjs instance')
    })

    it('setTimeToDatetimeHelper ok', async () => {

        let date = new Dayjs('2020-01-01')
        let result = setTimeToDatetimeHelper(date,"06:25")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2020-01-01 06:25')
    })


    it('setDateToDatetimeHelper should throw error if date is not dayjs instance', async () => {

        let date = '2020-01-01'
        assert.throws(() => setDateToDatetimeHelper(date,"2020-01-17"),Error,'Date is not a Dayjs instance')
    })

    it('setDateToDatetimeHelper ok', async () => {

        let datetime = new Dayjs('2020-01-01 15:30')
        let result = setDateToDatetimeHelper(datetime,"2020-01-17")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2020-01-17 15:30')
    })

})
