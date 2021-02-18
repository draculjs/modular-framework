"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Dayjs = _interopRequireDefault(require("../utils/Dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
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

    getDateTimeCustomFormat() {
      return (date, format = "YYYY-MM-DD HH:mm:ss", tz = "America/Buenos_Aires") => {
        return (0, _Dayjs.default)(date).tz(tz).format(format);
      };
    }

  }
};
exports.default = _default;