const date = require('./date.js');
const path = require('path');
const fs = require('iofs');
const optc = (obj) => Object.prototype.toString.call(obj);
const makeConfig = require('../rollup.config.js');
const rollup = require('rollup');
const terser = require('terser');
const { sep } = path;

function isFunction(obj) {
  return typeof obj === 'function';
}

function isArray (obj) { 
  return optc(obj) === '[object Array]' ;
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
  let result = path.join(__dirname, '..', '..');
  for (let it of [...new Set(arguments)]) {
    result = path.join(result, it);
  };
  return result;
}

function write (dest, code, zip = true) {
  return new Promise(async (resolve, reject) => {
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
    fs.echo(minCode.code, dest);
    resolve(minCode.code);
  })
}
async function build (source, dest) {
  
  let configs = await makeConfig.genConfigs({source, dest});
  const bundle = await rollup.rollup(configs.input);
  const res = await bundle.generate(configs.output);
  await write(configs.output.file, res.output[0].code);
}
// const reg = new RegExp(`${sep}[(\\w-\\.*)]+`, 'g');
const reg = fixReg('/[(\\w-\\.*)]+');
async function copyFile (source, dest, cb) {
  if (!fs.isdir(source)) {
    let code = fs.cat(source).toString();
    if (/\.wc$/.test(source)) {
      let filename = source.match(reg).slice(0,-1).join('');
      fs.echo(isFunction(cb) 
        ? await cb(code, filename) 
        : code, dest.replace(/\.wc$/, '.js'));
    } else if (/\.scss|\.css$/.test(source)) {
      let filename = source.match(reg).slice(0,-1).join('');
      code = fs.cat(`${filename}${sep}index.wc`).toString();
      dest = `${dest.match(reg).slice(0,-1).join('')}${sep}index.js`;

      fs.echo(isFunction(cb) 
        ? await cb(code, filename) 
        : code, dest.replace(/\.wc$/, '.js'));
    } else if (/\.js$/.test(source))  {
      await build(source, dest);
    }
  }
}

function matchFileFormat(filename) {
  return filename.lastIndexOf('.') ? filename.slice(filename.lastIndexOf('.') + 1) : '';
}

function matchFileName(filename) {
  return filename.slice(filename.lastIndexOf('/') + 1);
}

function matchProject(filename) {
  const res = filename.match(fixReg('package/([\\w\\W]*?)/', false)) || [];
  return res ? res[1] : '';
}

function fixReg(p, isGlobal = true) {
  return new RegExp(p.split('/').join(sep).replace('(.*).', '\\.'), isGlobal ? 'g' : '');
}

exportPlugins(exports, {
  resolve,
  copyFile,
  isArray,
  date,
  matchFileFormat,
  matchFileName,
  matchProject,
  fixReg
});
