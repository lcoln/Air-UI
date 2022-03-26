const path = require('path')
const fs = require('iofs')
const uglify = require('uglify-js')
const less = require('less')

const base_less = `
* {margin:0;padding: 0;box-sizing: border-box;}
a {text-decoration: none;}
a:focus {outline: none;}
`

// 编译样式
async function compileLess(code = '') {
  try {
    const style = await less.render(code) || { css: '' }
    return style.css
  } catch (err) {}
}

// 过滤出依赖项, 样式或者js
function fixImport(str, filename, source) {
  let css = ''
  str = str
    .replace(/import '([\w-/.]*)'/g, function ($1, $2) {
      let result = $1
      let index = $2.lastIndexOf('.')
      let suff = $2.substr(index + 1)
      if (index > -1 && !['js', 'css', 'less'].includes(suff)) {
        result = `import "${$2}.js"`
      } else if (['css', 'less'].includes(suff)) {
        if (fs.exists(path.resolve(source, '..', $2)))
          css = fs.cat(path.resolve(source, '..', $2))
        css = css && css.toString() || ''
        result = ''
      }
      return result
    })
    .replace(
      /import ([\w\s,{}]*) from '([a-z0-9\/\.\-_]*)'/g,
      function ($1, $2, $3) {
        let result = $1
        let index = $3.lastIndexOf('.')
        if (index > -1 && $3.substr(index + 1) !== 'js') {
          result = `import ${$2} from "${$3}.js"`
        }
        return result
      }
    )
  return { code: str, css }
}

// 将wc文件编译成js文件输出
async function mkWCFile ({ style, html, js }, filename, source) {

  let name
  let { code, css } = fixImport(js, filename, source)
  let props = `''`
  let data = ''
  style = await compileLess(base_less + style + css)

  let innerHTML = `'<style>${style}</style>${html}'`
  innerHTML = innerHTML
    .replace(/[\n\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(<!--[\s\S]*?-->)/g, '')
  
  code = code
    .replace(/props = (\{\}|\{[\w\W]*?\n\s{2}?\})/, function(s, m) {
      props = m
      let script = `var props = ${m}, attr = []; for(var i in props){attr.push(i)}; return attr;`
      var attr = new Function(script)()
      return `static get observedAttributes() {
          return ${JSON.stringify(attr)}
        }
        `
    })
    .replace(/data = (\{\}|\{[\w\W]*?\n\s{2}?\})/, function(s, m) {
      data = `
      let data = ${m} || {}
      try {
        for (let it of Object.keys(data)) {
          this[it] = data[it]
        }
      } catch (e) {}`
      return ``
    })
    .replace(/class ([a-zA-Z0-9]+)/, function(s, m) {
        name = m
        return `${s} extends HTMLElement `
    })
    .replace(
      '/* render */', 
      `constructor(e) {
          super(e)
          Object.defineProperty(this, "root", {
            value: this.attachShadow({
                mode: "open"
            }),
            writable: !0,
            enumerable: !1,
            configurable: !0
          })
          Object.defineProperty(this, 'props', {
            value: ${props},
            writable: true,
            enumerable: false,
            configurable: true
          })
          this.root.innerHTML = ${innerHTML}
          this.__ELM__ = Array.from(this.root.children)
          this.__DOM__ = this.__ELM__[1]
          this?.__REGIESTRYCONFIG__()
          ${data}
      }`)
    .replace('mounted', 'connectedCallback')
    .replace('unmount', 'disconnectedCallback')
    .replace('watch', 'attributeChangedCallback')
    .replace('adopted', 'adoptedCallback')
    // 后续增加render生命周期
    // .replace(/mounted[\w\W]\([\w\W]?\)[\w\W]\{([\w\W]*)\}/, function(s, m) {
    //   console.log({s, m})
    //   return s
    // })
    .replace(/\n\r+/g, '')
    // console.log(code)
    let result = uglify.minify({[filename]: code}).code
    // console.log({name})
    return uglify.minify(`'use strict'

${result}`
)
}

module.exports = async function build ({source, dest, filename, code}) {

  let style = code.match(/<style[^>]*?>([\w\W]*?)<\/style>/)
  let html = code.match(/<template>([\w\W]*?)<\/template>/)
  let js = code.match(/<script>([\w\W]*?)<\/script>/)

  style = style ? style[1] : ''
  html = html ? html[1] : ''
  js = js ? js[1] : ''
  let result = await mkWCFile({ style, html, js }, filename, source)    
  // console.log({result})
  fs.echo(result.code, dest.replace(/\.wc$/, '.js'))
  return result.code
  
}