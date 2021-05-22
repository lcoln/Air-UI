var bundle = (function () {
  return function defSingleProp(obj, key, getter) {
    let val
    Object.defineProperty(obj, key, {
      get() {
        if (!val) {
          val = getter()
        }
        Object.defineProperty(obj, key, {
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