import dayjsImported from 'dayjs'
import utc from'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import objectSupport from "dayjs/plugin/objectSupport"
export const dayjs = dayjsImported

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(objectSupport);

export default dayjs
