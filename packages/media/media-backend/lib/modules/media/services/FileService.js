"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFileRest = exports.updateFile = exports.updateByRelativePath = exports.paginateFiles = exports.findFile = exports.findAndDeleteExpiredFiles = exports.findAndDeleteByExpirationDate = exports.fetchFiles = exports.deleteFile = void 0;

var _FileModel = _interopRequireDefault(require("./../models/FileModel"));

var _apolloServerExpress = require("apollo-server-express");

var _File = require("../../media/permissions/File");

var _dayjs = _interopRequireDefault(require("dayjs"));

var _UserStorageService = require("./UserStorageService");

var _fs = _interopRequireDefault(require("fs"));

var _loggerBackend = require("@dracul/logger-backend");

var _userBackend = require("@dracul/user-backend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const findFile = async function (id, userId = null, allFilesAllowed, ownFilesAllowed, publicAllowed) {
  if (id) {
    let userGroups = await _userBackend.GroupService.fetchMyGroups(userId);
    return new Promise((resolve, reject) => {
      _FileModel.default.findOne({
        _id: id,
        ...filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)
      }).populate('createdBy.user').exec((err, res) => err ? reject(err) : resolve(res));
    });
  } else {
    throw new Error({
      message: 'id field is required'
    });
  }
};

exports.findFile = findFile;

const fetchFiles = async function (expirationDate = null) {
  function filter(expirationDate) {
    let operationsRange = {};
    let dateSinceForQuery = null;
    let dateUntilForQuery = null;

    if (expirationDate) {
      dateSinceForQuery = new Date(expirationDate);
      dateSinceForQuery.setHours(0);
      dateSinceForQuery.setMinutes(0);
      dateUntilForQuery = new Date(expirationDate);
      dateUntilForQuery.setHours(23);
      dateUntilForQuery.setMinutes(59);
      operationsRange = {
        $and: [{
          createdAt: {
            $gte: dateSinceForQuery
          }
        }, {
          createdAt: {
            $lte: dateUntilForQuery
          }
        }]
      };
    }

    return operationsRange;
  }

  const query = filter(expirationDate);
  return new Promise((resolve, reject) => {
    _FileModel.default.find(query).populate('createdBy.user').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchFiles = fetchFiles;

function filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups = []) {
  let q = {};
  if (allFilesAllowed) return q;

  if (ownFilesAllowed && publicAllowed) {
    q = {
      $or: [{
        'createdBy.user': userId
      }, {
        'isPublic': true
      }, {
        'groups': {
          $in: userGroups
        }
      }, {
        'users': {
          $in: [userId]
        }
      }]
    };
  } else if (ownFilesAllowed) {
    q = {
      $or: [{
        'createdBy.user': userId
      }, {
        'groups': {
          $in: userGroups
        }
      }, {
        'users': {
          $in: [userId]
        }
      }]
    };
  } else if (publicAllowed) {
    q = {
      $or: [{
        'isPublic': true
      }, {
        'groups': {
          $in: userGroups
        }
      }, {
        'users': {
          $in: [userId]
        }
      }]
    };
  } else {
    throw new Error("User doesn't have permissions for reading files");
  }

  return q;
}

const paginateFiles = async function ({
  pageNumber = 1,
  itemsPerPage = 5,
  search = null,
  filters,
  orderBy = null,
  orderDesc = false
}, userId = null, allFilesAllowed = false, ownFilesAllowed = false, publicAllowed = false) {
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

    if (filters) {
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
              let dayAfter = (0, _dayjs.default)(value).isValid() && (0, _dayjs.default)(value).add(1, 'day');

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

          case 'isPublic':
            value && (qsFilter.isPublic = {
              [operator]: value
            });
            break;

          case 'groups':
            value && (qsFilter.groups = {
              [operator]: value
            });
            break;

          case 'users':
            value && (qsFilter.users = {
              [operator]: value
            });
            break;

          default:
            break;
        }
      });
      return qsFilter;
    }
  }

  let userGroups = await _userBackend.GroupService.fetchMyGroups(userId);
  let query = { ...qs(search),
    ...filterValues(filters),
    ...filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)
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

const updateFile = async function (authUser, {
  id,
  description,
  tags,
  expirationDate,
  isPublic,
  groups,
  users
}, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
  return new Promise(async (resolve, rejects) => {
    let userGroups = await _userBackend.GroupService.fetchMyGroups(userId);

    _FileModel.default.findOneAndUpdate({
      _id: id,
      ...filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)
    }, {
      description,
      tags,
      expirationDate,
      isPublic,
      groups,
      users
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
}; // Rest service


exports.updateFile = updateFile;

const updateFileRest = function (id, user, permissionType, input) {
  // VER
  return new Promise(async (resolve, reject) => {
    let updatedFile = purgeInput(input);

    if (!input || Object.entries(input).length == 0) {
      throw reject({
        message: "File content can not be empty",
        status: 400
      });
    }

    let userStorage = await (0, _UserStorageService.findUserStorageByUser)(user);
    let timeDiffExpirationDate = validateExpirationDate(input.expirationDate);

    if (timeDiffExpirationDate > userStorage.fileExpirationTime) {
      throw reject({
        message: `File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`,
        status: 403
      });
    } // Find file and update it with the request body


    _FileModel.default.findOneAndUpdate({
      _id: id,
      ...filterByPermissions(permissionType, user.id)
    }, {
      $set: updatedFile
    }, {
      new: true
    }).then(file => {
      if (!file) {
        throw reject({
          message: `file not found with id ${id}`,
          status: 404
        });
      }

      resolve(file);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        throw reject({
          message: `file not found with id ${id}`,
          status: 404
        });
      }

      throw reject({
        message: `Error updating file with id ${id}. Error: ${err}`,
        status: 500
      });
    });
  });
};

exports.updateFileRest = updateFileRest;

const updateByRelativePath = function (relativePath) {
  return new Promise((resolve, rejects) => {
    _FileModel.default.findOneAndUpdate({
      relativePath: relativePath
    }, {
      lastAccess: Date.now(),
      '$inc': {
        hits: 1
      }
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

const deleteFile = function (id, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
  return new Promise((resolve, rejects) => {
    findFile(id, userId, allFilesAllowed, ownFilesAllowed, publicAllowed).then(async doc => {
      if (doc) {
        try {
          _fs.default.unlink(doc.relativePath, error => {
            if (error) _loggerBackend.DefaultLogger.error(error);else _loggerBackend.DefaultLogger.info('Se eliminó el archivo ' + doc.relativePath);
          });

          await _FileModel.default.deleteOne({
            _id: id
          });
          await (0, _UserStorageService.updateUserUsedStorage)(userId, -doc.size);
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
      $match: {
        expirationDate: {
          $eq: null
        }
      }
    }, {
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
          $cond: [{
            $eq: ["$userStorage.deleteByLastAccess", true]
          }, {
            $subtract: ["$$NOW", "$lastAccess"]
          }, {
            $subtract: ["$$NOW", "$createdAt"]
          }]
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
  });
  return deleteAndUnlinkFiles(docs);
};

exports.findAndDeleteExpiredFiles = findAndDeleteExpiredFiles;

const findAndDeleteByExpirationDate = async function () {
  let expirationDate = new Date();
  let docs = [];
  await fetchFiles(expirationDate).then(result => {
    docs = result;
  }).catch(error => {
    _loggerBackend.DefaultLogger.error('FileService - findAndDeleteByExpirationDate - Error en aggregate: ' + error);
  });
  return deleteAndUnlinkFiles(docs);
};

exports.findAndDeleteByExpirationDate = findAndDeleteByExpirationDate;

function deleteAndUnlinkFiles(docs) {
  // For each de los files con unlink y actualizo usedSpace de userStorage
  if (docs) {
    unlinkFiles(docs);
  } // Mappeo los ids de los files encontrados


  let fileIds = docs.map(file => {
    return file._id;
  }); // Borro los files encontrados

  return deleteManyById(fileIds);
}

function unlinkFiles(files) {
  files.forEach(file => {
    (0, _UserStorageService.updateUserUsedStorage)(file.createdBy.user, -file.size);

    _fs.default.unlink(file.relativePath, error => {
      if (error) _loggerBackend.DefaultLogger.error('FileService - findExpiredFiles. No se borró el archivo ' + file.relativePath + ':' + error);else _loggerBackend.DefaultLogger.info('Se eliminó el archivo ' + file.relativePath);
    });
  });
}

function deleteManyById(ids) {
  return new Promise((resolve, reject) => {
    _FileModel.default.deleteMany({
      _id: {
        $in: ids
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
}

function validateExpirationDate(expirationTime) {
  const today = new Date();
  const expirationDate = new Date(expirationTime);

  if (expirationDate > today) {
    return ((expirationDate - today) / (1000 * 3600 * 24)).toFixed(2);
  }

  return null;
}

function purgeInput(input) {
  let updatedFile = {};

  for (const key in input) {
    if (key == 'description' || key == 'expirationDate' || key == 'tags' || key == 'isPublic') {
      updatedFile[key] = input[key];
    }
  }

  return updatedFile;
}