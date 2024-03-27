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

            if (timezone) {
                return dayjs.tz(date, timezone)
            } else {
                return dayjs.tz(date)
            }
        }
    },
    computed: {
        getDateFormat() {
            return (date) => {

                function isTimestamp(valor) {
                    const regex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
                    return regex.test(valor) && (new Date(parseInt(valor))).getTime() > 0;
                }

                if (!date)
                    return null

                //DAYJS
                if (dayjs.isDayjs(date)) {
                    return date.format("YYYY-MM-DD")
                }

                //ISO
                if (/(\d{4})-(\d{2})-(\d{2})T/.test(date) && dayjs(date).isValid()) {
                    return dayjs(date).tz().format("YYYY-MM-DD")
                }

                //FORMAT YYYY-MM-DD
                if (/(\d{4})-(\d{2})-(\d{2})/.test(date)) {
                    return date
                }

                //TIMESTAMP
                if(isTimestamp(date)){
                    return dayjs(parseInt(date)).tz().format("YYYY-MM-DD")
                }

                return dayjs(parseInt(date)).tz().format("YYYY-MM-DD")
            }
        },
        getDateTimeFormat() {
            return (date, showSeconds = false, showMilliseconds = false) => {

                function isTimestamp(valor) {
                    const regex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
                    return regex.test(valor) && (new Date(parseInt(valor))).getTime() > 0;
                }

                if (!date) return null

                let format = "YYYY-MM-DD HH:mm"

                if (showSeconds) format += ":ss"
                if (showMilliseconds) format += ":SSS"

                //DAYJS
                if (dayjs.isDayjs(date)) return date.format(format)

                //ISO
                if (/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.test(date) && dayjs(date).isValid()) {
                    return dayjs(date).tz().format(format)
                }

                //FORMAT YYYY-MM-DD HH:mm:ss
                if (/(\d{4})-(\d{2})-(\d{2})( (\d{2}):(\d{2})(:(\d{2}))?)?/.test(date)) return date

                //TIMESTAMP
                if(isTimestamp(date)){
                    return dayjs(parseInt(date)).tz().format(format)
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
