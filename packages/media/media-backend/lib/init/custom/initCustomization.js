"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCustomization = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _customizeBackend = require("@dracul/customize-backend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initCustomization = async function () {
  let customDoc = await (0, _customizeBackend.findCustomization)();

  if (!customDoc) {
    let customDoc = await (0, _customizeBackend.createCustomization)({
      colors: {
        primary: '#3F51B5',
        onPrimary: '#FFFFFF',
        secondary: '#1565C0',
        onSecondary: '#FFFFFF'
      },
      logo: {
        mode: 'Round',
        title: 'APP',
        filename: 'logo.png',
        url: process.env.APP_API_URL + '/media/logo/logo.png'
      },
      language: 'es'
    });

    _winston.default.info("Customization created: " + customDoc.id);
  } else {
    _winston.default.debug("Customization found: " + customDoc.id);
  }
};

exports.initCustomization = initCustomization;