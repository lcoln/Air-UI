import registerT from './package/tools/index.js'
import register from './package/wc/index.js'

export const installModule = (module) => register(module)
export const installTool = (module) => registerT(module)
