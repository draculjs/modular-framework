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
        },
        convertStringDateToDayjs(date, timezone) {
            if (!date)
                return null

            if(timezone){
                return dayjs.tz(date,timezone)
            }else{
                return dayjs.tz(date)
            }
        }
    },
    computed: {
        getDateFormat() {
            return (date) => {

                if (!date)
                    return null

                if (dayjs.isDayjs(date)) {
                    return date.format("YYYY-MM-DD")
                }

                if (/(\d{4})-(\d{2})-(\d{2})/.test(date)) {
                    return date
                }


                return dayjs(parseInt(date)).tz().format("YYYY-MM-DD")
            }
        },
        getDateTimeFormat() {
            return (date, showSeconds = false) => {

                if (!date)
                    return null


                let format = "YYYY-MM-DD HH:mm"

                if (showSeconds)
                    format += ":ss"

                if (dayjs.isDayjs(date)) {
                    return date.format(format)
                }

                if (/(\d{4})-(\d{2})-(\d{2})( (\d{2}):(\d{2})(:(\d{2}))?)?/.test(date)) {
                    return date
                }

                return dayjs(parseInt(date)).tz().format(format)
            }
        },
        getTimeFormat() {
            return (date, showSeconds = false) => {

                if (!date)
                    return null

                let format = "HH:mm"

                if (showSeconds)
                    format += ":ss"

                if (dayjs.isDayjs(date)) {
                    return date.format(format)
                }

                if (/(\d{2}):(\d{2})(:(\d{2}))?/.test(date)) {
                    return date
                }

                return dayjs(parseInt(date)).tz().format(format)
            }
        },
        getDateTimeCustomFormat() {
            return (date, format, tz) => {

                if (!date)
                    return null


                if (!tz)
                    tz = dayjs.tz.guess()

                if (!format)
                    format = "YYYY-MM-DD HH:mm:ss"

                if (dayjs.isDayjs(date)) {
                    return date.tz(tz).format(format)
                }

                if (/(\d{4})-(\d{2})-(\d{2})( (\d{2}):(\d{2})(:(\d{2}))?)?/.test(date)) {
                    return date
                }

                return dayjs(parseInt(date)).tz(tz).format(format)
            }
        }
    }
}
