var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc') // dependent on utc plugin
var timezone = require('dayjs/plugin/timezone')
var customParseFormat = require('dayjs/plugin/customParseFormat')
var objectSupport = require("dayjs/plugin/objectSupport");
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(objectSupport);

module.exports = dayjs
