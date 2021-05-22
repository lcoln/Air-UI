var bundle = (function () {
  return function defSingleClassProp(clazz, key, getter) {
    Object.defineProperty(clazz.prototype, key, {
      get() {
        if (!this === clazz.prototype) {
          return null;
        }
        const val = getter.call(this)
        Object.defineProperty(this, key, {
          value: val,
          configurable: true
        })
        return val;
      },
      configurable: true
    })
  }
})()

export default bundle