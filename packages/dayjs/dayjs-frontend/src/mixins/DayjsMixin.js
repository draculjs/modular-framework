import dayjs from '../utils/Dayjs'


export default {
    computed: {
        getDateFormat(){
            return (date) => {
                return dayjs(date).tz().format("YYYY-MM-DD")
            }
        },
        getDateTimeFormat(){
            return (date) => {
                return dayjs(date).tz().format("YYYY-MM-DD HH:mm:ss")
            }
        },
        getDateTimeCustomFormat(){
            return (date, format = "YYYY-MM-DD HH:mm:ss", tz = "America/Buenos_Aires") => {
                return dayjs(date).tz(tz).format(format)
            }
        }
    }
}
