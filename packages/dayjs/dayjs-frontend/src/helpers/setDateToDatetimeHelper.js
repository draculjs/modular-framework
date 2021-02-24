import Dayjs from '../utils/Dayjs'
import {isDayjs} from 'dayjs'
/**
 *
 * @param {Dayjs} sourceDate
 * @param {string} newDate
 * @return {Dayjs}
 */
const setDateToDatetimeHelper = (sourceDate, newDate) => {

    if(sourceDate === null || sourceDate === ''){
        sourceDate = Dayjs()
    }else if(!(isDayjs(sourceDate))){
        throw new Error("Date is not a Dayjs instance")
    }

    return  Dayjs(newDate).hour(sourceDate.hour()).minute(sourceDate.minute())
}

export default setDateToDatetimeHelper
