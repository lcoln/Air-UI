const remAdapter = {
  scale: 0,
  defaultFontSize: 0,
  initMeta () {
    let dpr, scale
    // var isAndroid = win.navigator.appVersion.match(/android/gi)
    var isIPhone = window.navigator.appVersion.match(/iphone/gi)
    var devicePixelRatio = window.devicePixelRatio || 1
    if (isIPhone) {
      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
        dpr = 2
      } else {
        dpr = 1
      }
    } else {
      // 其他设备下，仍旧使用1倍的方案
      dpr = 1
    }
    scale = 1 / dpr

    let oldMeta = document.querySelector('meta[name=viewport]')
    if (oldMeta) {
      oldMeta.remove()
    }

    var metaEl = document.createElement('meta')
    metaEl.setAttribute('name', 'viewport')
    // <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0">
    metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
    if (document.firstElementChild) {
      document.documentElement.firstElementChild.appendChild(metaEl)
    } else {
      var wrap = document.createElement('div')
      wrap.appendChild(metaEl)
      document.write(wrap.innerHTML)
    }
  },
  install: function (config) {
    this.initMeta()
    var self = this
    var baseWidth = config.uiSize
    var documentHTML = document.documentElement
    var d = window.document.createElement('div')
    d.style.width = '1rem'
    d.style.display = 'none'
    var head = window.document.getElementsByTagName('head')[0]
    head.appendChild(d)
    self.defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'))
    d.parentNode.removeChild(d)
    function setRootFont () {
      var docWidth = documentHTML.getBoundingClientRect().width
      self.scale = docWidth / baseWidth
      // if (docWidth > baseWidth) {
      //   self.scale = 0.5
      // }
      documentHTML.style.setProperty('font-size', self.scale * 100 / self.defaultFontSize * 100 + '%', 'important')
    }
    setRootFont()
    window.addEventListener('resize', setRootFont, false)
  },
  remToPx: function (rem) {
    return rem * this.scale * 100 / this.defaultFontSize * 16
  },
  pxToRem: function (px) {
    return px / 16 / (100 / this.defaultFontSize) / this.scale
  }
}

export default remAdapter