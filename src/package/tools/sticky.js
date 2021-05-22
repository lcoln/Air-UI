var bundle = (function () {

  return function (dom, config = {}) {
    const { offsetTop, style = {} } = config
    const resetStyle = Object.keys(style).reduce((item, next) => {
      item[next] = ''
      return item
    }, {})
  
    window.addEventListener('scroll', () => {
      const st = document.body.scrollTop 
        || document.documentElement.scrollTop;
      st >= offsetTop 
        ? Object.assign(dom.style, style) 
        : Object.assign(dom.style, resetStyle)
    });

  }
})()

export default bundle
