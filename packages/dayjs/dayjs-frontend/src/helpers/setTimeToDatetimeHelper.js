import parseDatetimeSourceHelper from './parseDatetimeSourceHelper'
/**
 *
 * @param {Dayjs} sourceDate
 * @param {string} newTime
 * @return {Dayjs}
 */
const setTimeToDatetimeHelper = (sourceDate, newTime) => {

    if (newTime === null || newTime === '') {
        return null
    }

    sourceDate = parseDatetimeSourceHelper(sourceDate)

    let timeSplit = newTime.split(":")
    let hour = parseInt(timeSplit[0])
    let minute = parseInt(timeSplit[1])

    return  sourceDate.hour(hour).minute(minute)
}

export default setTimeToDatetimeHelper
