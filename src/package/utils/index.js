
export const hideProperty = (host, name, value) => {
  Object.defineProperty(host, name, {
    value: value,
    writable: true,
    enumerable: false,
    configurable: true
  })
}
export const optc = (obj) => Object.prototype.toString.call(obj)
export const promise = (func) => new Promise(func.bind(this))
export const sleep = (time) => promise(yes => setTimeout(yes, time))
export const isArray = (obj) => optc(obj) === '[object Array]'
export const isObject = (obj) => optc(obj) === '[object Object]'
export const isString = (obj) => optc(obj) === '[object String]'
export const isNumber = (obj) => optc(obj) === '[object Number]'
export const isFunction = (obj) => optc(obj) === '[object Function]'