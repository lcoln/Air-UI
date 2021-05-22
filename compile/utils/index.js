const date = require('./date.js')
const path = require('path')
const fs = require('iofs')
const optc = (obj) => Object.prototype.toString.call(obj)
const makeConfig = require('../rollup.config.js')
const rollup = require('rollup')
const terser = require('terser')

// import date from './date.js'
// import path from 'path'
// import fs from 'iofs'
// import makeConfig from '../rollup.config1.js'
// import rollup from 'rollup'
// import terser from 'terser'

// const rollup = require('rollup')
// const terser = require('terser')
// const optc = (obj) => Object.prototype.toString.call(obj)

function isFunction(obj) {
  return typeof obj === 'function'
}

function isArray (obj) { 
  return optc(obj) === '[object Array]' 
}

function exportPlugins(obj, mappings) {
  Object.keys(mappings).forEach(name => {
    Object.defineProperty(obj, name, {
      configurable: false,
      enumerable: true,
      value: mappings[name]
    });
  });
}

function resolve () {
  let result = path.join(__dirname, '../..')
  for (let it of [...new Set(arguments)]) {
    result = path.join(result, it)
  }
  return result
}

function write (dest, code, zip = true) {
  return new Promise(async (resolve, reject) => {
    // const dirName = dest.slice(0, dest.lastIndexOf('/'))
    const minCode = await terser.minify(code, {
      output: {
        ascii_only: true,
        keep_quoted_props: true
      },
      compress: {
        pure_funcs: ['makeMap']
      },
      module: true,
      toplevel: true,
      nameCache: {},
    })
    // console.log({dest, ccc: minCode.code})
    fs.echo(minCode.code, dest)
    // console.log({res})
    resolve(minCode.code)
  })
}
async function build (source, dest) {
  
  let configs = await makeConfig.genConfigs({source, dest})
  // console.log({configs})
  const bundle = await rollup.rollup(configs.input);
  const res = await bundle.generate(configs.output);
  // console.log({aa: res.output})
  await write(configs.output.file, res.output[0].code)
}

async function copyFile (source, dest, cb) {
  console.log({source, dest})
  if (!fs.isdir(source)) {
    let code = fs.cat(source).toString()
    if (/\.wc$/.test(source)) {
      let filename = source.match(/\/[(\w-\.*)]+/g).slice(0,-1).join('')
      /*if (/\/tools\/./.test(source)) {
        filename = source.match(/\/[(\w-\.*)]+/g).join('')
      } */
      // console.log({filename})
      fs.echo(isFunction(cb) ? await cb(code, filename) : code, dest.replace(/\.wc$/, '.js'))
    } else if (/\.scss|\.css$/.test(source)) {
      let filename = source.match(/\/[(\w-\.*)]+/g).slice(0,-1).join('')
      code = fs.cat(`${filename}/index.wc`).toString()
      dest = `${dest.match(/\/[(\w-\.*)]+/g).slice(0,-1).join('')}/index.js`
      // console.log({dest, source})
      fs.echo(isFunction(cb) ? await cb(code, filename) : code, dest.replace(/\.wc$/, '.js'))
    } else if (/\.js$/.test(source))  {
      console.log({source, dest})
      // fs.echo(code, dest)
      await build(source, dest)
    }
  }
}

function matchFileFormat(filename) {
  return filename.lastIndexOf('.') ? filename.slice(filename.lastIndexOf('.') + 1) : ''
}

function matchFileName(filename) {
  return filename.slice(filename.lastIndexOf('/') + 1)
}

function matchProject(filename) {
  const res = filename.match(/package\/([\w\W]*?)\//) || []
  return res ? res[1] : ''
}

exportPlugins(exports, {
  resolve,
  copyFile,
  isArray,
  date,
  matchFileFormat,
  matchFileName,
  matchProject
});

// export {
//   resolve,
//   copyFile,
//   isArray,
//   date
// }