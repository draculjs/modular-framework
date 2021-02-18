import dayjs from '../utils/Dayjs'
import setTimeToDatetimeHelper from "../helpers/setTimeToDatetimeHelper";
import setDateToDatetimeHelper from "../helpers/setDateToDatetimeHelper";

export default {
    methods: {
        setTimeToFormField(field, newTime) {
            this.form[field] = setTimeToDatetimeHelper(this.form[field], newTime)
        },
        setDateToFormField(field, newDate) {
            this.form[field] = setDateToDatetimeHelper(this.form[field], newDate)
        }
    },
    computed: {
        getDateFormat() {
            return (date) => {

                if(!date)
                    return null

                if(/[0-9]{13}/.test(date))
                    date = parseInt(date)

                return dayjs(date).tz().format("YYYY-MM-DD")
            }
        },
        getDateTimeFormat() {
            return (date) => {

                if(!date)
                    return null

                if(/[0-9]{13}/.test(date))
                    date = parseInt(date)

                return dayjs(date).tz().format("YYYY-MM-DD HH:mm:ss")
            }
        },
        getTimeFormat() {
            return (date) => {

                if(!date)
                    return null

                if(/[0-9]{13}/.test(date))
                    date = parseInt(date)

                return dayjs(date).tz().format("HH:mm")
            }
        },
        getDateTimeCustomFormat() {
            return (date, format = "YYYY-MM-DD HH:mm:ss", tz = "America/Buenos_Aires") => {

                if(!date)
                    return null

                if(/[0-9]{13}/.test(date))
                    date = parseInt(date)

                return dayjs(date).tz(tz).format(format)
            }
        }
    }
}
