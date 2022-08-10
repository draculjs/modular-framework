"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileUserMetrics = exports.fileGlobalMetrics = exports.cantidadArchivosPorUsuario = exports.almacenamientoPorUsuario = void 0;

var _FileModel = _interopRequireDefault(require("./../models/FileModel"));

var _generateColors = _interopRequireDefault(require("../util/generateColors"));

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

const aggregateCantidadDeArchivosPorFecha = async function () {
  return new Promise((resolve, reject) => {
    const aggregate = _FileModel.default.aggregate([{
      $group: {
        _id: {
          month: {
            $month: "$createdAt"
          },
          year: {
            $year: "$createdAt"
          }
        },
        count: {
          $sum: 1
        },
        weight: {
          $sum: "$size"
        }
      }
    }, {
      $sort: {
        "_id.year": -1,
        "_id.month": -1
      }
    }]);

    aggregate.exec().then(docs => {
      resolve(docs);
    }).catch(err => reject(err));
  });
};

const aggregateAlmacenamientoPorUsuario = async function () {
  return new Promise((resolve, reject) => {
    const aggregate = _FileModel.default.aggregate([{
      $group: {
        _id: {
          user: "$createdBy.user"
        },
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
    }, {
      $sort: {
        "user": -1
      }
    }]);

    aggregate.exec().then(docs => {
      resolve(docs);
    }).catch(err => reject(err));
  });
};

const fileUserMetrics = async function () {
  let docs = await aggregateCantidadDeArchivosPorFecha();
  let date = new Date(Date.now());
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let labels = [];
  let dataset = [];
  let dataCount = [];
  let dataWeigth = [];

  for (let i = 0; i < 5; i++) {
    let monthToPush = month - i;
    let yearToPush = 0;

    if (monthToPush < 1) {
      yearToPush = year - 1;
      monthToPush = 12 + monthToPush;
    } else {
      yearToPush = year;
    }

    labels.unshift(monthToPush + '/' + yearToPush.toString().substring(2, 4));
    let docToPush = docs.filter(x => x._id.month == monthToPush && x._id.year == yearToPush);

    if (docToPush[0]) {
      dataCount.unshift(docToPush[0].count);
      dataWeigth.unshift(docToPush[0].weight);
    } else {
      dataCount.unshift(0);
      dataWeigth.unshift(0);
    }
  }

  dataset.push({
    label: "countLabel",
    data: dataCount
  });
  dataset.push({
    label: "sizeLabel",
    data: dataWeigth
  });
  return {
    labels: labels,
    dataset: dataset
  };
};

exports.fileUserMetrics = fileUserMetrics;

const almacenamientoPorUsuario = async function () {
  let docs = await aggregateAlmacenamientoPorUsuario();
  let labels = docs.map(item => item.user);
  let weights = docs.map(item => item.weight);
  let colors = docs.map((item, index) => (0, _generateColors.default)(index));
  let dataset = [{
    label: 'Weight',
    data: weights,
    backgroundColor: colors
  }];
  return {
    labels: labels,
    dataset: dataset
  };
};

exports.almacenamientoPorUsuario = almacenamientoPorUsuario;

const cantidadArchivosPorUsuario = async function () {
  let docs = await aggregateAlmacenamientoPorUsuario();
  let labels = docs.map(item => item.user);
  let fileCount = docs.map(item => item.count);
  let colors = docs.map((item, index) => (0, _generateColors.default)(index));
  let dataset = [{
    label: 'Count',
    data: fileCount,
    backgroundColor: colors
  }];
  return {
    labels: labels,
    dataset: dataset
  };
};

exports.cantidadArchivosPorUsuario = cantidadArchivosPorUsuario;

const generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

const generateRandomColor = function () {
  return `rgba(${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)})`;
};