import Dayjs from '../utils/Dayjs'
import {isDayjs} from 'dayjs'
/**
 *
 * @param {Dayjs} sourceDate
 * @param {string} newDate
 * @return {Dayjs}
 */
const setDateToDatetimeHelper = (sourceDate, newDate) => {

    if(!(isDayjs(sourceDate)))
        throw new Error("sourceDate is not a Dayjs instance")

    return  Dayjs(newDate).hour(sourceDate.hour()).minute(sourceDate.minute())
}

export default setDateToDatetimeHelper
