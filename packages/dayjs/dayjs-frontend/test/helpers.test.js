const Dayjs = require('../src/utils/Dayjs')
import setTimeToDatetimeHelper from "../src/helpers/setTimeToDatetimeHelper"
import setDateToDatetimeHelper from "../src/helpers/setDateToDatetimeHelper";
var assert = require('assert');
const {AssertionError} = require('assert');


describe("Helpers", () => {


    it('setTimeToDatetimeHelper should accept a valid string source date', async () => {

        let date = '2020-01-01'
        let result = setTimeToDatetimeHelper(date,"03:25")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2020-01-01 03:25')
    })

    it('setTimeToDatetimeHelper should preserve date when source date is a timestamp string', async () => {

        let date = '1746658800000'
        let result = setTimeToDatetimeHelper(date,"15:45")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2025-05-07 15:45')
    })

    it('setTimeToDatetimeHelper should throw error if source date is invalid', async () => {

        let date = 'not-a-date'
        assert.throws(() => setTimeToDatetimeHelper(date,"03:25"),Error,'Date is not a Dayjs instance')
    })

    it('setTimeToDatetimeHelper ok', async () => {

        let date = new Dayjs('2020-01-01')
        let result = setTimeToDatetimeHelper(date,"06:25")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2020-01-01 06:25')
    })


    it('setDateToDatetimeHelper should accept a valid string source datetime', async () => {

        let date = '2020-01-01 15:30'
        let result = setDateToDatetimeHelper(date,"2020-01-17")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2020-01-17 15:30')
    })

    it('setDateToDatetimeHelper should preserve time when source date is a timestamp string', async () => {

        let date = '1746658800000'
        let result = setDateToDatetimeHelper(date,"2025-05-10")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2025-05-10 20:00')
    })

    it('setDateToDatetimeHelper should throw error if source date is invalid', async () => {

        let date = 'not-a-date'
        assert.throws(() => setDateToDatetimeHelper(date,"2020-01-17"),Error,'Date is not a Dayjs instance')
    })

    it('setDateToDatetimeHelper ok', async () => {

        let datetime = new Dayjs('2020-01-01 15:30')
        let result = setDateToDatetimeHelper(datetime,"2020-01-17")
        assert.strictEqual(result.format("YYYY-MM-DD HH:mm"),'2020-01-17 15:30')
    })

})
