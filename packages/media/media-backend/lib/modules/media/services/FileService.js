"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAndDeleteExpiredFiles = exports.deleteFile = exports.updateByRelativePath = exports.updateFile = exports.paginateFiles = exports.fetchFiles = exports.findFile = void 0;

var _FileModel = _interopRequireDefault(require("./../models/FileModel"));

var _apolloServerExpress = require("apollo-server-express");

var _File = require("../../media/permissions/File");

var _dayjs = _interopRequireDefault(require("dayjs"));

var _UserStorageService = require("./UserStorageService");

var _fs = _interopRequireDefault(require("fs"));

var _loggerBackend = require("@dracul/logger-backend");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const findFile = async function (id, permissionType = null, userId = null) {
  if (id) {
    return new Promise((resolve, reject) => {
      _FileModel.default.findOne({
        _id: id,
        ...filterByFileOwner(permissionType, userId)
      }).populate('createdBy.user').exec((err, res) => err ? reject(err) : resolve(res));
    });
  } else {
    throw new Error({
      message: 'id field is required'
    });
  }
};

exports.findFile = findFile;

const fetchFiles = async function () {
  return new Promise((resolve, reject) => {
    _FileModel.default.find({}).populate('createdBy.user').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchFiles = fetchFiles;

const paginateFiles = function ({
  pageNumber = 1,
  itemsPerPage = 5,
  search = null,
  filters,
  orderBy = null,
  orderDesc = false
}, permissionType = null, userId = null) {
  function qs(search) {
    let qs = {};

    if (search) {
      qs = {
        $or: [{
          filename: {
            $regex: search,
            $options: 'i'
          }
        }]
      };
    }

    return qs;
  }

  function getSort(orderBy, orderDesc) {
    if (orderBy) {
      return (orderDesc ? '-' : '') + orderBy;
    } else {
      return null;
    }
  }

  function filterValues(filters) {
    let qsFilter = {};
    filters.forEach(({
      field,
      operator,
      value
    }) => {
      switch (field) {
        case 'dateFrom':
          if (value) {
            let dayBefore = (0, _dayjs.default)(value).isValid() && (0, _dayjs.default)(value);
            qsFilter.createdAt = {
              [operator]: dayBefore.$d
            };
          }

          break;

        case 'dateTo':
          if (value) {
            let dayAfter = (0, _dayjs.default)(value).isValid() && (0, _dayjs.default)(value);

            if (qsFilter.createdAt) {
              qsFilter.createdAt = { ...qsFilter.createdAt,
                [operator]: dayAfter.$d
              };
            } else {
              qsFilter.createdAt = {
                [operator]: dayAfter.$d
              };
            }
          }

          break;

        case 'filename':
          value && (qsFilter.filename = {
            [operator]: value,
            $options: "i"
          });
          break;

        case 'createdBy.user':
          value && (qsFilter["createdBy.user"] = {
            [operator]: value
          });
          break;

        case 'type':
          value && (qsFilter.type = {
            [operator]: value,
            $options: "i"
          });
          break;

        case 'minSize':
          value && (qsFilter.size = {
            [operator]: parseFloat(value)
          });
          break;

        case 'maxSize':
          if (value) {
            if (qsFilter.size) {
              qsFilter.size = { ...qsFilter.size,
                [operator]: parseFloat(value)
              };
            } else {
              qsFilter.size = {
                [operator]: parseFloat(value)
              };
            }
          }

          break;

        default:
          break;
      }
    });
    return qsFilter;
  }

  let query = { ...qs(search),
    ...filterByFileOwner(permissionType, userId),
    ...filterValues(filters)
  };
  let populate = ['createdBy.user'];
  let sort = getSort(orderBy, orderDesc);
  let params = {
    page: pageNumber,
    limit: itemsPerPage,
    populate,
    sort
  };
  return new Promise((resolve, reject) => {
    _FileModel.default.paginate(query, params).then(result => {
      resolve({
        items: result.docs,
        totalItems: result.totalDocs,
        page: result.page
      });
    }).catch(err => reject(err));
  });
};

exports.paginateFiles = paginateFiles;

const updateFile = async function (authUser, id, {
  description,
  tags
}, permissionType, userId) {
  return new Promise((resolve, rejects) => {
    _FileModel.default.findOneAndUpdate({
      _id: id,
      ...filterByFileOwner(permissionType, userId)
    }, {
      description,
      tags
    }, {
      new: true,
      runValidators: true,
      context: 'query'
    }, (error, doc) => {
      if (error) {
        if (error.name == "ValidationError") {
          rejects(new _apolloServerExpress.UserInputError(error.message, {
            inputErrors: error.errors
          }));
        }

        rejects(error);
      }

      if (doc) {
        doc.populate('createdBy.user').execPopulate(() => resolve(doc));
      } else {
        rejects('File not found');
      }
    });
  });
};

exports.updateFile = updateFile;

const updateByRelativePath = function (relativePath) {
  return new Promise((resolve, rejects) => {
    _FileModel.default.findOneAndUpdate({
      relativePath: relativePath
    }, {
      lastAccess: Date.now()
    }, {
      runValidators: true,
      context: 'query'
    }, (error, doc) => {
      if (error) {
        rejects(error);
      }

      if (doc) {
        resolve(doc);
      } else {
        rejects('File not found');
      }
    });
  });
};

exports.updateByRelativePath = updateByRelativePath;

const deleteFile = function (id, permissionType, userId) {
  return new Promise((resolve, rejects) => {
    findFile(id, permissionType, userId).then(async doc => {
      if (doc) {
        try {
          (0, _UserStorageService.updateUserUsedStorage)(userId, -doc.size);

          _fs.default.unlink(doc.relativePath, error => {
            if (error) _loggerBackend.DefaultLogger.error(error);else _loggerBackend.DefaultLogger.info('Se eliminó el archivo ' + doc.relativePath);
          });

          await _FileModel.default.deleteOne({
            _id: id
          });
          resolve({
            id: id,
            success: true
          });
        } catch (err) {
          rejects(err);
        }
      } else {
        rejects('File not found');
      }
    });
  });
};

exports.deleteFile = deleteFile;

const findAndDeleteExpiredFiles = async function () {
  function getDataEntity() {
    return [{
      $lookup: {
        from: "userstorages",
        localField: "createdBy.user",
        foreignField: "user",
        as: "userStorage"
      }
    }, {
      $unwind: "$userStorage"
    }, {
      $addFields: {
        timeDiffInMillis: {
          $subtract: ["$$NOW", "$lastAccess"]
        }
      }
    }, {
      $addFields: {
        timeDiffInDays: {
          $divide: ["$timeDiffInMillis", 24 * 60 * 60 * 1000]
        }
      }
    }, {
      $addFields: {
        roundedTime: {
          $round: ["$timeDiffInDays", 0]
        }
      }
    }, {
      $match: {
        $expr: {
          $lte: ["$userStorage.fileExpirationTime", "$roundedTime"]
        }
      }
    }];
  }

  const entityData = getDataEntity();
  const aggregateData = [entityData];
  let docs = [];
  await _FileModel.default.aggregate(aggregateData).then(result => {
    docs = result;
  }).catch(error => {
    _loggerBackend.DefaultLogger.error('FileService - findExpiredFiles - Error en aggregate: ' + error);
  }); // For each de los files con unlink y actualizo usedSpace de userStorage

  if (docs) {
    docs.forEach(file => {
      (0, _UserStorageService.updateUserUsedStorage)(file.createdBy.user, -file.size);

      _fs.default.unlink(file.relativePath, error => {
        if (error) _loggerBackend.DefaultLogger.error('FileService - findExpiredFiles. No se borró el archivo ' + file.relativePath + ':' + error);else _loggerBackend.DefaultLogger.info('Se eliminó el archivo ' + file.relativePath);
      });
    });
  } // Mappeo los ids de los files encontrados


  let fileIds = docs.map(file => {
    return file._id;
  }); // Borro los files encontrados

  return new Promise((resolve, reject) => {
    _FileModel.default.deleteMany({
      _id: {
        $in: fileIds
      }
    }).then(result => {
      resolve({
        ok: result.ok,
        deletedCount: result.deletedCount
      });
    }).catch(err => {
      _loggerBackend.DefaultLogger.error('FileService - findExpiredFiles. Error en deleteMany: ' + error);

      reject({
        ok: err.ok,
        deletedCount: err.deletedCount
      });
    });
  });
};

exports.findAndDeleteExpiredFiles = findAndDeleteExpiredFiles;

function filterByFileOwner(permissionType, userId) {
  let query;

  switch (permissionType) {
    // Si el user es dueño del archivo (o es admin), puede encontrarlo, actualizarlo o borrarlo
    case _File.FILE_SHOW_OWN:
    case _File.FILE_UPDATE_OWN:
    case _File.FILE_DELETE_OWN:
      query = {
        'createdBy.user': userId
      };
      break;

    default:
      break;
  }

  return query;
}