"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = exports.updateFile = exports.paginateFiles = exports.fetchFiles = exports.findFile = void 0;

var _FileModel = _interopRequireDefault(require("./../models/FileModel"));

var _apolloServerExpress = require("apollo-server-express");

var _File = require("../../media/permissions/File");

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
    _FileModel.default.find({}).isDeleted(false).populate('createdBy.user').exec((err, res) => err ? reject(err) : resolve(res));
  });
};

exports.fetchFiles = fetchFiles;

const paginateFiles = function (pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false, permissionType = null, userId = null) {
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

  let query = {
    deleted: false,
    ...qs(search),
    ...filterByFileOwner(permissionType, userId)
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

const deleteFile = function (id, permissionType, userId) {
  return new Promise((resolve, rejects) => {
    findFile(id, permissionType, userId).then(doc => {
      if (doc) {
        doc.softdelete(function (err) {
          err ? rejects(err) : resolve({
            id: id,
            success: true
          });
        });
      } else {
        rejects('File not found');
      }
    });
  });
};

exports.deleteFile = deleteFile;

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