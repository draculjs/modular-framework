"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Dayjs = _interopRequireDefault(require("../utils/Dayjs"));
var _setTimeToDatetimeHelper = _interopRequireDefault(require("../helpers/setTimeToDatetimeHelper"));
var _setDateToDatetimeHelper = _interopRequireDefault(require("../helpers/setDateToDatetimeHelper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = {
  methods: {
    setTimeToFormField(field, newTime) {
      this.form[field] = (0, _setTimeToDatetimeHelper.default)(this.form[field], newTime);
    },
    setDateToFormField(field, newDate) {
      this.form[field] = (0, _setDateToDatetimeHelper.default)(this.form[field], newDate);
    },
    convertStringDateToDayjs(date, timezone) {
      if (!date) return null;
      if (timezone) {
        return _Dayjs.default.tz(date, timezone);
      } else {
        return _Dayjs.default.tz(date);
      }
    }
  },
  computed: {
    getDateFormat() {
      return date => {
        function isTimestamp(valor) {
          const regex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
          return regex.test(valor) && new Date(parseInt(valor)).getTime() > 0;
        }
        if (!date) return null;

        //DAYJS
        if (_Dayjs.default.isDayjs(date)) {
          return date.format("YYYY-MM-DD");
        }

        //ISO
        if (/(\d{4})-(\d{2})-(\d{2})T/.test(date) && (0, _Dayjs.default)(date).isValid()) {
          return (0, _Dayjs.default)(date).tz().format("YYYY-MM-DD");
        }

        //FORMAT YYYY-MM-DD
        if (/(\d{4})-(\d{2})-(\d{2})/.test(date)) {
          return date;
        }

        //TIMESTAMP
        if (isTimestamp(date)) {
          return (0, _Dayjs.default)(parseInt(date)).tz().format("YYYY-MM-DD");
        }
        return (0, _Dayjs.default)(parseInt(date)).tz().format("YYYY-MM-DD");
      };
    },
    getDateTimeFormat() {
      return (date, showSeconds = false, showMilliseconds = false) => {
        function isTimestamp(valor) {
          const regex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
          return regex.test(valor) && new Date(parseInt(valor)).getTime() > 0;
        }
        if (!date) return null;
        let format = "YYYY-MM-DD HH:mm";
        if (showSeconds) format += ":ss";
        if (showMilliseconds) format += ":SSS";

        //DAYJS
        if (_Dayjs.default.isDayjs(date)) return date.format(format);

        //ISO
        if (/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.test(date) && (0, _Dayjs.default)(date).isValid()) {
          return (0, _Dayjs.default)(date).tz().format(format);
        }

        //FORMAT YYYY-MM-DD HH:mm:ss
        if (/(\d{4})-(\d{2})-(\d{2})( (\d{2}):(\d{2})(:(\d{2}))?)?/.test(date)) return date;

        //TIMESTAMP
        if (isTimestamp(date)) {
          return (0, _Dayjs.default)(parseInt(date)).tz().format(format);
        }
        return (0, _Dayjs.default)(parseInt(date)).tz().format(format);
      };
    },
    getTimeFormat() {
      return (date, showSeconds = false) => {
        if (!date) return null;
        let format = "HH:mm";
        if (showSeconds) format += ":ss";
        if (_Dayjs.default.isDayjs(date)) {
          return date.format(format);
        }
        if (/(\d{2}):(\d{2})(:(\d{2}))?/.test(date)) {
          return date;
        }
        return (0, _Dayjs.default)(parseInt(date)).tz().format(format);
      };
    },
    getDateTimeCustomFormat() {
      return (date, format, tz) => {
        if (!date) return null;
        if (!tz) tz = _Dayjs.default.tz.guess();
        if (!format) format = "YYYY-MM-DD HH:mm:ss";
        if (_Dayjs.default.isDayjs(date)) {
          return date.tz(tz).format(format);
        }
        if (/(\d{4})-(\d{2})-(\d{2})( (\d{2}):(\d{2})(:(\d{2}))?)?/.test(date)) {
          return date;
        }
        return (0, _Dayjs.default)(parseInt(date)).tz(tz).format(format);
      };
    }
  }
};