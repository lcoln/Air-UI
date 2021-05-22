let head = document.getElementsByTagName('head')[0]
let assestMap = {}

class Assests{
  constructor (uri) {
    this.uri = uri
    this.state = 0//0未加载 1加载中 2加载完成
    this.callbacks = []
  }

  start(callback) {
    if (this.state === 2) {
      callback(true)
      return
    }
    if (this.state === 1) {
      this.callbacks.push(callback)
      return
    }
    this.state = 1
    if (this.el) {
      this.el.onload = null
      this.el.onerror = null
      this.el.parentNode.removeChild(this.el)
    }
    this.makeEl(callback)
  }

  makeEl (callback) {
    let self = this
    let type = {
      css: 'link',
      js: 'script'
    }
    let tag = type[this.uri.substr(this.uri.lastIndexOf('.') + 1)] || 'script'
    console.log({tag})
    this.el = document.createElement(tag)
    this.el.onload = () => {
      this.callbacks.push(callback)
      self.callResult(true)
    }
    this.el.onerror = () => {
      self.callResult(false)
    }
    if (tag === 'link') {
      this.el.rel = 'stylesheet'
      this.el.type = 'text/css'
      this.el.href = this.uri
    } else {
      this.el.async = "async"
      this.el.src = this.uri
    }

    head.insertBefore(this.el, head.lastChild)
  }

  callResult (result) {
    let callbacks = this.callbacks
    this.callbacks = []
    this.state = result ? 2 : 0
    callbacks.forEach(callback => callback(result))
  }
}

export default {
  load (uri) {
    return new Promise((resolve, reject) =>{
      let assestObj = assestMap[uri]
      if (!assestObj) {
        assestObj = new Assests(uri)
        assestMap[uri] = assestObj
      }
      assestObj.start((result) => {
        resolve(result)
      })
    })
  },
  async loads (uris) {
    if (Object.prototype.toString.call(uris) !== '[object Array]')
      uris = [uris]
    
    for (let it of uris) {
      await this.load(it)
    }
  }
}