"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Dayjs = _interopRequireDefault(require("../utils/Dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  methods: {
    setTime(field, time) {
      let timeSplit = time.split(":");
      let hour = timeSplit[0];
      let minute = timeSplit[1];
      this[field].hour(hour);
      this[field].minute(minute);
    },

    setDate(field, date) {}

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