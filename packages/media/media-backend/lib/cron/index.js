"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cronManager = void 0;

var _loggerBackend = require("@dracul/logger-backend");

var _FileService = require("../modules/media/services/FileService");

var _nodeCron = _interopRequireDefault(require("node-cron"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();
/**
 * @description
 * findAndDeleteExpiredFiles: encuentra archivos expirados y los elimina.
 * */


const cronManager = () => {
  if (!_nodeCron.default.validate(process.env.MEDIA_DELETE_FILES_CRON)) {
    throw new Error("Valor de variable de entorno MEDIA_DELETE_FILES_CRON no válido");
  }

  if (process.env.MEDIA_DELETE_FILES_CRON) {
    _nodeCron.default.schedule(process.env.MEDIA_DELETE_FILES_CRON, async () => {
      let success;

      try {
        _loggerBackend.DefaultLogger.info("CronManager findAndDeleteExpiredFiles starting ");

        success = await (0, _FileService.findAndDeleteExpiredFiles)();

        _loggerBackend.DefaultLogger.info("CronManager findAndDeleteExpiredFiles finished. Deleted count " + success.deletedCount);
      } catch (e) {
        _loggerBackend.DefaultLogger.error("CronManager findAndDeleteExpiredFiles error", e);
      }

      try {
        _loggerBackend.DefaultLogger.info("CronManager findAndDeleteByExpirationDate starting ");

        success = await (0, _FileService.findAndDeleteByExpirationDate)();

        _loggerBackend.DefaultLogger.info("CronManager findAndDeleteByExpirationDate finished. Deleted count " + success.deletedCount);
      } catch (e) {
        _loggerBackend.DefaultLogger.error("CronManager findAndDeleteByExpirationDate error", e);
      }
    }, {
      scheduled: true
    });
  }
};

exports.cronManager = cronManager;