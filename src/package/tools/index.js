import { isString } from '../utils/index.js';

export default async function (module) {
  module = isString(module) ? [module] : module
  let tools = {}
  while (module.length) {
    try {
      let name = module.shift()
      tools[name] = await import(`./${name}/index.js`)
    } catch (e) {
      console.log({e})
    }
  }
  return tools
}