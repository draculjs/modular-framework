"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = exports.updateFile = exports.paginateFiles = exports.fetchFiles = exports.findFile = void 0;

var _FileModel = _interopRequireDefault(require("./../models/FileModel"));

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const findFile = async function (id) {
  if (id) {
    return new Promise((resolve, reject) => {
      _FileModel.default.findOne({
        _id: id
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

const paginateFiles = function (pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) {
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
    ...qs(search)
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
}) {
  return new Promise((resolve, rejects) => {
    _FileModel.default.findOneAndUpdate({
      _id: id
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

      doc.populate('createdBy.user').execPopulate(() => resolve(doc));
    });
  });
};

exports.updateFile = updateFile;

const deleteFile = function (id) {
  return new Promise((resolve, rejects) => {
    findFile(id).then(doc => {
      doc.softdelete(function (err) {
        err ? rejects(err) : resolve({
          id: id,
          success: true
        });
      });
    });
  });
};

exports.deleteFile = deleteFile;