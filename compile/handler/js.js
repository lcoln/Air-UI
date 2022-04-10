const fs = require('iofs');
const makeConfig = require('../rollup.config.js');
const rollup = require('rollup');
const terser = require('terser');
const { fixReg } = require('../utils');

function write (dest, code, filename, project, format) {
  const alias = makeConfig.getAlias(project);
  return new Promise(async (resolve, reject) => {
    const minCode = await terser.minify(code + '', {
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
    let realCode = minCode.code;
    if (alias) {
      for (let k of Object.keys(alias)) {
        realCode = realCode.replace(k, alias[k]);
      }
    }
    fs.echo(realCode, dest);
    resolve(realCode);
  })
}

module.exports = async function build ({source, dest, filename, format, project}) {
  const tmp = source.split('/');
  const l = tmp.length - tmp.lastIndexOf(project);
  
  // wc项目里的js无需进行rollup打包, 会直接压缩输出
  if (format === 'js' 
    && (
      (fixReg('/wc/')).test(source) 
        || (fixReg('/src/index.js')).test(source))
  ) {
    return write(dest, fs.cat(source), filename, project, format);
  }
  if (fixReg('/src/config.js').test(source) || 
    (l > 3 || (l === 3 && !/^index\.(t|j)s$/.test(tmp[tmp.length - 1]))) &&
    project
  ) {
    return;
  }

  let configs = makeConfig.genConfigs({source, dest, filename, project, format});
  const bundle = await rollup.rollup(configs.input);
  await bundle.write(configs.output);
  await bundle.close();
}