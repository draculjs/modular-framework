"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.userCreateListener = void 0;

var _userBackend = require("@dracul/user-backend");

const userCreateListener = function () {
  _userBackend.UserService.UserEventEmitter.on('created', doc => {
    console.log('usuario creado: ', doc.username);
  }); // UserModel.schema.post('save', function (doc) {
  //     console.log('%s has been saved', doc._id);
  // });

};

exports.userCreateListener = userCreateListener;
var _default = userCreateListener;
exports.default = _default;