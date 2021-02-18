import Dayjs from '../utils/Dayjs'
import {isDayjs} from 'dayjs'
/**
 *
 * @param {Dayjs} sourceDate
 * @param {string} newTime
 * @return {Dayjs}
 */
const setTimeToDatetimeHelper = (sourceDate, newTime) => {

    if(sourceDate === null || sourceDate === ''){
        sourceDate = Dayjs()
    }else if(!(isDayjs(sourceDate))){
        throw new Error("Date is not a Dayjs instance")
    }

    let timeSplit = newTime.split(":")
    let hour = parseInt(timeSplit[0])
    let minute = parseInt(timeSplit[1])

    return  Dayjs(sourceDate).hour(hour).minute(minute)
}

export default setTimeToDatetimeHelper
