import registerT from './package/tools/index.js'
import register from './package/wc/index.js'
export { default as fetch } from './package/tools/fetch/index.esm.js'
export { default as router } from './package/tools/router/index.esm.js'

export const installWC = (module, config) => register(module, config)
export const installTool = (module) => registerT(module)