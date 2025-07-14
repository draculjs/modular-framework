// vite-cjs-wrapper.cjs
'use strict'

const { defineConfig } = require('vite')

// Exporta una función wrapper para compatibilidad
module.exports = (config) => {
  if (typeof config === 'function') {
    return defineConfig(config)
  }
  return defineConfig(config)
}