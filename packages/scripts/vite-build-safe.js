#!/usr/bin/env node
import { build } from 'vite'
import path from 'path'
import fs from 'fs'

const packageDir = process.cwd()
const configPath = path.join(packageDir, 'vite.config.js')

try {
  // Verificar si la configuración existe
  if (!fs.existsSync(configPath)) {
    console.warn(`Vite config not found in ${packageDir}, skipping build`)
    process.exit(0)
  }
  
  // Construir el paquete
  console.log(`Building ${packageDir}...`)
  await build({
    configFile: configPath,
    logLevel: 'warn'
  })
  
  console.log(`Build completed for ${packageDir}`)
} catch (error) {
  console.error(`Build failed for ${packageDir}:`, error.message)
  process.exit(1)
}