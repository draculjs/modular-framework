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
            return (date, showSeconds = false) => {

                if(!date)
                    return null

                if(/[0-9]{13}/.test(date))
                    date = parseInt(date)

                let format = "YYYY-MM-DD HH:mm"

                if(showSeconds)
                    format += ":ss"

                return dayjs(date).tz().format(format)
            }
        },
        getTimeFormat() {
            return (date, showSeconds = false) => {

                if(!date)
                    return null

                if(/[0-9]{13}/.test(date))
                    date = parseInt(date)

                let format = "HH:mm"

                if(showSeconds)
                    format += ":ss"

                return dayjs(date).tz().format(format)
            }
        },
        getDateTimeCustomFormat() {
            return (date, format, tz) => {

                if(!date)
                    return null

                if(/[0-9]{13}/.test(date))
                    date = parseInt(date)

                if(!tz)
                    tz = dayjs.tz.guess()

                if(!format)
                    format = "YYYY-MM-DD HH:mm:ss"

                return dayjs(date).tz(tz).format(format)
            }
        }
    }
}
