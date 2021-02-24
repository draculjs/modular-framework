"use strict";

const Datetime = require('../utils/Dayjs');

const dateObjectTimezone = function (date) {
  let obj = {};
  obj.hour = new Datetime(date).tz("America/Argentina/Buenos_Aires").format('HH');
  obj.day = new Datetime(date).tz("America/Argentina/Buenos_Aires").format('DD');
  obj.month = new Datetime(date).tz("America/Argentina/Buenos_Aires").format('MM');
  obj.year = new Datetime(date).tz("America/Argentina/Buenos_Aires").format('YYYY');
  return obj;
};

module.exports = dateObjectTimezone;