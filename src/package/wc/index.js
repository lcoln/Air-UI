import * as utils from '../utils/index.js';
import { hideProperty, isString } from '../utils/index.js';
import init from './init.js';

export default async function (module, baseConfig = {framework: 'react'}) {
  init()
  module = isString(module) ? [module] : module
  hideProperty(HTMLElement.prototype, 'Utils', utils)
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
      console.log({config})
  
      if(!customElements.get(name)){
        let m = (await import(`./${name}`)).default
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