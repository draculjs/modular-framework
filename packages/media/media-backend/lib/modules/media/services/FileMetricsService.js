"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileUserMetrics = exports.fileGlobalMetrics = void 0;

var _FileModel = _interopRequireDefault(require("./../models/FileModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fileGlobalMetrics = async function () {
  return new Promise((resolve, reject) => {
    const aggregate = _FileModel.default.aggregate([{
      $group: {
        _id: "global",
        count: {
          $sum: 1
        },
        weight: {
          $sum: "$size"
        }
      }
    }]);

    aggregate.exec().then(docs => {
      resolve(docs[0]);
    }).catch(err => reject(err));
  });
};

exports.fileGlobalMetrics = fileGlobalMetrics;

const fileUserMetrics = async function () {
  return new Promise((resolve, reject) => {
    const aggregate = _FileModel.default.aggregate([{
      $group: {
        _id: "$createdBy.user",
        user: {
          $first: "$createdBy.username"
        },
        count: {
          $sum: 1
        },
        weight: {
          $sum: "$size"
        }
      }
    }]);

    aggregate.exec().then(docs => {
      console.log(docs);
      resolve(docs);
    }).catch(err => reject(err));
  });
};

exports.fileUserMetrics = fileUserMetrics;