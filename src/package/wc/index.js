import * as utils from '../utils/index.js';
import { hideProperty, isString } from '../utils/index.js';
import init from './init.js';

export default async function (module) {
  init()
  module = isString(module) ? [module] : module
  hideProperty(HTMLElement.prototype, 'Utils', utils)
  // await import(`./icon-wc/index.js`)
  while (module.length) {
    try {
      let name = module.shift()
      let m = await import(`./${name}/index.js`)
      // window.customElements.define(name, m.default);
    } catch (e) {
      console.log({e})
    }
  }
}