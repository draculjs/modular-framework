import Dayjs from '../utils/Dayjs'
import {isDayjs} from 'dayjs'

const isTimestamp = (value) => {
    if (typeof value === 'number') return (new Date(value)).getTime() > 0
    if (typeof value !== 'string') return false

    const regex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/
    return regex.test(value) && (new Date(parseInt(value))).getTime() > 0
}

const parseDatetimeSourceHelper = (sourceDate) => {
    if(sourceDate === null || sourceDate === '' || sourceDate === undefined){
        return Dayjs()
    }

    if (isDayjs(sourceDate)) {
        return sourceDate
    }

    const parsedSourceDate = isTimestamp(sourceDate)
        ? Dayjs(parseInt(sourceDate))
        : Dayjs(sourceDate)

    if (!parsedSourceDate.isValid()) {
        throw new Error("Date is not a Dayjs instance")
    }

    return parsedSourceDate
}

export default parseDatetimeSourceHelper
