const { nodeResolve } = require('@rollup/plugin-node-resolve');
const aliasPlugin = require('@rollup/plugin-alias');
const { terser } = require('rollup-plugin-terser')

const { FORMAT = 'esm' } = process.env

function getConfig({alias = {}, source, dest, filename, format}) {
  let baseConfig = {
    input: {
      external: [],
      plugins: [
        // commonjs(),
        // json()
        // babel()
      ]
    },
    output: {
      inlineDynamicImports: true,   // 允许import()
      extend: true,
      format: FORMAT,
      globals: {
        '@': 'src'
      },
  
      banner: '',
      footer: '',
      // intro: 'var intro = "intro";',
      // outro: 'var outro = "outro";',
      // sourcemap: true,
      sourcemapFile: '.',
      plugins: [
        // getBabelOutputPlugin({
        //   allowAllFormats: true,
        //   "presets": [
        //     [
        //       "@babel/preset-env",
        //       {
        //         // "useBuiltIns": "usage",
        //         // "corejs": "3"
        //         // "debug": true
        //       }
        //     ]
        //   ],
        //   "plugins": [
        //     [
        //       "@babel/plugin-transform-runtime",
        //       {
        //         // "corejs": "3" // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
        //       }
        //     ]
        //   ]
  
        // })
      ]
    }
  }

  baseConfig.input.input = source
  baseConfig.output.file = dest
  baseConfig.output.name = filename.split('.')[0]

  switch(format) {
    case "js":
      let aliasKeys = Object.keys(alias)
      let inputPulgin
      if (Object.keys(alias).length) {
        inputPulgin = aliasPlugin({
          entries: aliasKeys.map(k => ({
            find: k, replacement: alias[k]
          }))
        })
      }
      baseConfig.input.plugins.push(nodeResolve({
        browser: true,
        preferBuiltins: false
      }))
      
      if (inputPulgin) {
        baseConfig.input.plugins.push(inputPulgin)
      }
      baseConfig.input.plugins.push(terser())
      return baseConfig
    case "less":
      baseConfig = {
        input: {
          input: source,
          external: [],
          plugins: [
            require('rollup-plugin-less')({
              output: dest,
              option: {
                compress: false
              }
            })
          ]
        },
      }
      return baseConfig
  }
}

module.exports = {
  getAlias(project) {
    if (!project) return null
    const config = require('../src/config')
    const c = config.genConfig(project) || {}
    // let key = c.alias ? Object.keys(c.alias)[0] : ''
    // let val = c.alias ? c.alias[k] : ''
    return c.alias
  },
  // 如果不是工程入口, 则新建一层项目目录并把`index.${FORMAT}.js`作为项目入口
  regenerateDest(dest, filename) {
    if (!/(\/(tools|utils)\/index\.js|\/package\/styles\/)/.test(dest)) {
      let project = filename.split('.')[0]
      dest = dest.split('/')
      if (project !== 'index') {
        dest.splice(-1, 0, project)
      }
      dest[dest.length - 1] = `index.${FORMAT}.js`
      dest = dest.join('/')
    }
    return dest
  },
  genConfigs: function ({source, dest, filename, project, format}) {
    
    const config = getConfig({
      alias: this.getAlias(project), 
      dest: this.regenerateDest(dest, filename), 
      source,
      filename,
      format
    })
    return config
  },
  getPushServerConfig: function (env) {
    return{
      url: "api.static.igeekee.cn",
      path: "/data/www/static.igeekee.cn/theme"
    }
  },
  getCdnConfig: function (env) {
    return {
      url: env.MODE == "PROD" ? 'static.igeekee.cn' : 'imgtest.clickwifi.net',
      path: ''
    }
  }
}
//  //imgtest.igeekee.cn/...