const path = require('path');
function getFileName(path) {
  return path.split('/').slice(-1)[0];
}

async function buildEntry (module) {
  module = [...new Set(module)];
  const chalk = require('chalk');
  const log = console.log;
  let format = process.env.FORMAT || 'iife';
  format = format.toLowerCase();
  log(chalk.red(`正在编译wc文件, 编译模式为 ${format}`));
  
  const rollup = require('rollup');
  const fs = require('iofs');
  const { resolve, isArray } = require('./utils');
  module = module ? isArray(module) ? module : [module] : null;
  const reg = new RegExp(`-wc$|(?:${path.sep.replace('\\', '\\\\')})tools$`);
  const dir = module && module.length 
    ? module 
    : recursion(resolve('./dist/package'), reg);

  function recursion (path, reg, result = []) {
    let isdir = fs.isdir(path);
    if (isdir) {
      for (let it of fs.ls(path)) {
        reg.test(it) && result.push({
          filepath: it,
          filename: getFileName(it)
        });
        recursion(it, reg, result);
      }
    }
    return result;
  }

  let config = require(`./rollup.config.js`);

  while (dir.length) {
    let { inputOptions, outputOptions } = config;
    let files = dir.shift();
    let { filepath, filename } = files;
    log(chalk.red(`正在编译${filename}`));
    
    const bundle = await rollup.rollup({...inputOptions, input: `${filepath}`});
    let formatFileName = filename.split('.');
    formatFileName.splice(-1, 0, format);
    formatFileName = formatFileName.join('.');

    const { output } = await bundle.generate({
      ...outputOptions, 
      file: filepath.replace('src', `dist`).replace(filename, formatFileName), 
      format
    });
    let res = await bundle.write({
      ...outputOptions, 
      file: filepath.replace('src', `dist`).replace(filename, formatFileName), 
      format
    });
  }
  log(chalk.whiteBright(`编译完成啦~`));
};

module.exports = buildEntry;