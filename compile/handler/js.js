import fs from 'iofs';
import makeConfig from '../rollup.config.js';
import { rollup } from 'rollup';
import { minify } from 'terser';
import { fixReg } from '../utils/index.js';

async function write (dest, code, filename, project, format) {
  const alias = await makeConfig.getAlias(project);
  return new Promise(async (resolve, reject) => {
    const minCode = await minify(code + '', {
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

export default async function build ({source, dest, filename, format, project}) {
  const tmp = source.split('/');
  const l = tmp.length - tmp.lastIndexOf(project);
  
  // wc项目里的js无需进行rollup打包, 会直接压缩输出
  if (format === 'js' 
    && (
      (fixReg('/wc/')).test(source) 
        || (fixReg('/src/index.js')).test(source))
  ) {
    return await write(dest, fs.cat(source), filename, project, format);
  }
  if (fixReg('/src/config.js').test(source) || 
    (l > 3 || (l === 3 && !/^index\.(t|j)s$/.test(tmp[tmp.length - 1]))) &&
    project
  ) {
    return;
  }

  let configs = await makeConfig.genConfigs({source, dest, filename, project, format});
  const bundle = await rollup(configs.input);
  await bundle.write(configs.output);
  await bundle.close();
}