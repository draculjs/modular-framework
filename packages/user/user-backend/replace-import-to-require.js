#!/usr/bin/env node

const FS     = require('fs')
const globby = require('globby')
const r1     = /^import \{+([a-zA-Z_$][a-zA-Z0-9_$]*)\}  +(from) (('|")[a-zA-Z0-9-_.\/]+('|"))/gm // import createStore from 'redux' ===> const createStore = require('redux')
const r3     = /^import \\{[a-zA-Z0-9-_.,\/]+\\} from (('|")[a-zA-Z0-9-_.\/]+('|"))/gm // import { createStore } from 'redux' ===> const { createStore } = require('redux')

const args = process.argv.slice(2)

if (!args.length) {
    console.error('Please pass a directory glob to "replace-require-with-import"\n')
    process.exit(1)
}

const paths = globby.sync(args)

paths.forEach(function (p) {
    if (!FS.statSync(p).isDirectory()) {
        return replaceInFile(p)
    }
})

function replaceInFile(fp) {
    const result = FS.writeFileSync(fp, FS.readFileSync(fp, 'utf-8')
        .replace(r3, `const { $3 } = require($5)`)
        .replace(r1, `const $2 = require($4)`), 'utf-8')
    console.log(`> ${fp}`)
    return result
}

console.info('Done!\n')