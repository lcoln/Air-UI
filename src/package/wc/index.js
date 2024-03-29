import * as utils from '../utils/index.js';
import { hideProperty, isString } from '../utils/index.js';
import init from './init.js';
const isBrowser = () => typeof window !== "undefined"
export default async function (module, baseConfig = {framework: 'react'}) {
  if (isBrowser()) {
    init()
    hideProperty(window.HTMLElement.prototype, 'Utils', utils)
  }
  module = isString(module) ? [module] : module
  while (module.length) {
    try {
      let wcObj = module.shift();
      let name = '';
      let config = {};

      if (utils.isString(wcObj)) {
        name = wcObj.toLowerCase()
      } else if (utils.isObject(wcObj)) {
        name = wcObj?.name?.toLowerCase();
        config = wcObj?.config;
      }
      // console.log({name, config})
  
      if(!customElements.get(name)){
        let m = (await import(`./${name}/index.js`)).default
        // console.log({m})
        hideProperty(m.prototype, '__REGIESTRYCONFIG__', function() {
          this.__WCCONFIG__ = config
          this.__BASECONFIG__ = baseConfig
        })
        
        customElements.define(name, m);
      }
    } catch (e) {
      console.log({e})
    }
  }
}