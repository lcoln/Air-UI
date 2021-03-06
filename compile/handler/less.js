const makeConfig = require('../rollup.config.js')
const rollup = require('rollup')
const { fixReg } = require('../utils')

module.exports = async function build ({source, dest, filename, format, project}) {
  
  // 目前只编译theme\d/*/index.less
  if (!fixReg('/theme\d?/\w+/index.less$').test(source)) {
    return
  }
  let configs = makeConfig.genConfigs({source, dest, filename, project, format})
  const bundle = await rollup.rollup(configs.input);
  await bundle.close();
}
