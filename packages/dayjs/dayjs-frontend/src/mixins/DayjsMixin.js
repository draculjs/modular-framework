import dayjs from '../utils/Dayjs'
import setTimeToDatetimeHelper from "../helpers/setTimeToDatetimeHelper";
import setDateToDatetimeHelper from "../helpers/setDateToDatetimeHelper";

export default {
    methods: {
        setTime(field, newTime) {
            this[field] = setTimeToDatetimeHelper(this[field], newTime)
        },
        setDate(field, newDate) {
            this[field] = setDateToDatetimeHelper(this[field], newDate)
        }
    },
    computed: {
        getDateFormat() {
            return (date) => {
                return dayjs(date).tz().format("YYYY-MM-DD")
            }
        },
        getDateTimeFormat() {
            return (date) => {
                return dayjs(date).tz().format("YYYY-MM-DD HH:mm:ss")
            }
        },
        getTimeFormat() {
            return (date) => {
                return dayjs(date).tz().format("HH:mm")
            }
        },
        getDateTimeCustomFormat() {
            return (date, format = "YYYY-MM-DD HH:mm:ss", tz = "America/Buenos_Aires") => {
                return dayjs(date).tz(tz).format(format)
            }
        }
    }
}
