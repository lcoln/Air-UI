import makeConfig from '../rollup.config.js'
import { rollup } from 'rollup'
import { fixReg } from '../utils/index.js'

export default async function build ({source, dest, filename, format, project}) {
  
  // 目前只编译theme\d/*/index.less
  if (!fixReg('/theme\d?/\w+/index.less$').test(source)) {
    return
  }
  let configs = await makeConfig.genConfigs({source, dest, filename, project, format})
  const bundle = await rollup(configs.input);
  await bundle.close();
}
