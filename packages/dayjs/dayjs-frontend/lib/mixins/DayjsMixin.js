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
        return (0, _Dayjs.default)(date).tz().format("YYYY-MM-DD");
      };
    },

    getDateTimeFormat() {
      return date => {
        if (!date) return null;
        return (0, _Dayjs.default)(date).tz().format("YYYY-MM-DD HH:mm:ss");
      };
    },

    getTimeFormat() {
      return date => {
        if (!date) return null;
        return (0, _Dayjs.default)(date).tz().format("HH:mm");
      };
    },

    getDateTimeCustomFormat() {
      return (date, format = "YYYY-MM-DD HH:mm:ss", tz = "America/Buenos_Aires") => {
        if (!date) return null;
        return (0, _Dayjs.default)(date).tz(tz).format(format);
      };
    }

  }
};
exports.default = _default;