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
      this.form[field] = (0, _setTimeToDatetimeHelper.default)(this[field], newTime);
    },

    setDateToFormField(field, newDate) {
      this.form[field] = (0, _setDateToDatetimeHelper.default)(this[field], newDate);
    }

  },
  computed: {
    getDateFormat() {
      return date => {
        return (0, _Dayjs.default)(date).tz().format("YYYY-MM-DD");
      };
    },

    getDateTimeFormat() {
      return date => {
        return (0, _Dayjs.default)(date).tz().format("YYYY-MM-DD HH:mm:ss");
      };
    },

    getTimeFormat() {
      return date => {
        return (0, _Dayjs.default)(date).tz().format("HH:mm");
      };
    },

    getDateTimeCustomFormat() {
      return (date, format = "YYYY-MM-DD HH:mm:ss", tz = "America/Buenos_Aires") => {
        return (0, _Dayjs.default)(date).tz(tz).format(format);
      };
    }

  }
};
exports.default = _default;