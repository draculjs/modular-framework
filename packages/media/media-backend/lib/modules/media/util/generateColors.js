"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const generateColors = function (index) {
  const colors = ['rgba(255, 99, 132)', 'rgba(75, 192, 192)', 'rgba(255, 205, 86)', 'rgba(255, 159, 64)', 'rgba(54, 162, 235)', 'rgba(128, 0, 128, 0.7)', 'rgba(0, 255, 255)', 'rgba(255, 0, 0)', 'rgba(192,192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 205, 86, 0.7)', 'rgba(255, 159, 64, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(128, 0, 128)', 'rgba(0, 255, 255, 0.7)', 'rgba(255, 0, 0, 0.7)', 'rgba(192,192, 192, 0.7)'];
  return colors[index];
};

var _default = generateColors;
exports.default = _default;