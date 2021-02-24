"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Dayjs = _interopRequireDefault(require("../utils/Dayjs"));

var _setTimeToDatetimeHelper = _interopRequireDefault(require("../helpers/setTimeToDatetimeHelper"));

var _setDateToDatetimeHelper = _interopRequireDefault(require("../helpers/setDateToDatetimeHelper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  methods: {
    setTimeToFormField(field, newTime) {
      this.form[field] = (0, _setTimeToDatetimeHelper.default)(this.form[field], newTime);
    },

    setDateToFormField(field, newDate) {
      this.form[field] = (0, _setDateToDatetimeHelper.default)(this.form[field], newDate);
    }

  },
  computed: {
    getDateFormat() {
      return date => {
        if (!date) return null;
        if (/[0-9]{13}/.test(date)) date = parseInt(date);
        return (0, _Dayjs.default)(date).tz().format("YYYY-MM-DD");
      };
    },

    getDateTimeFormat() {
      return (date, showSeconds = false) => {
        if (!date) return null;
        if (/[0-9]{13}/.test(date)) date = parseInt(date);
        let format = "YYYY-MM-DD HH:mm";
        if (showSeconds) format += ":ss";
        return (0, _Dayjs.default)(date).tz().format(format);
      };
    },

    getTimeFormat() {
      return (date, showSeconds = false) => {
        if (!date) return null;
        if (/[0-9]{13}/.test(date)) date = parseInt(date);
        let format = "HH:mm";
        if (showSeconds) format += ":ss";
        return (0, _Dayjs.default)(date).tz().format(format);
      };
    },

    getDateTimeCustomFormat() {
      return (date, format, tz) => {
        if (!date) return null;
        if (/[0-9]{13}/.test(date)) date = parseInt(date);
        if (!tz) tz = _Dayjs.default.tz.guess();
        if (!format) format = "YYYY-MM-DD HH:mm:ss";
        return (0, _Dayjs.default)(date).tz(tz).format(format);
      };
    }

  }
};
exports.default = _default;