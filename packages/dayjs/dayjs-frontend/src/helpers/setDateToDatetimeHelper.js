import Dayjs from '../utils/Dayjs'
import parseDatetimeSourceHelper from './parseDatetimeSourceHelper'
/**
 *
 * @param {Dayjs} sourceDate
 * @param {string} newDate
 * @return {Dayjs}
 */
const setDateToDatetimeHelper = (sourceDate, newDate) => {

    if (newDate === null || newDate === '') {
        return null
    }

    sourceDate = parseDatetimeSourceHelper(sourceDate)

    return  Dayjs(newDate).hour(sourceDate.hour()).minute(sourceDate.minute())
}

export default setDateToDatetimeHelper
