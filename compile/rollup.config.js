import { nodeResolve } from '@rollup/plugin-node-resolve'
import aliasPlugin from '@rollup/plugin-alias'
import { terser } from 'rollup-plugin-terser'
import extensions from 'rollup-plugin-extensions'
import typescript from 'rollup-plugin-typescript2'
import { babel } from '@rollup/plugin-babel'
import path from 'path'
import less from 'rollup-plugin-less'
import json from '@rollup/plugin-json';

const sep = path.sep.replace('\\', '\\\\');

const { FORMAT = 'esm' } = process.env

function getConfig({alias = {}, source, dest, filename, format}) {
  // console.log({dest});
  let baseConfig = {
    input: {
      external: [],
      plugins: []
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
      sourcemapFile: '.',
      plugins: [
      ]
    },
    plugins: [
      extensions({
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.esm.js', '.json'],
        resolveIndex: true,
      }),
      json()
    ]
  }

  baseConfig.input.input = source
  baseConfig.output.file = dest
  baseConfig.output.name = filename.split('.')[0]

  switch(format) {
    case "tsx":
      baseConfig.plugins.push(...[typescript(), babel({ 
        presets: [
          "@babel/preset-typescript", 
          '@babel/preset-env',
          '@babel/preset-react'
        ], 
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']  
      })])
    case "js":
      let aliasKeys = Object.keys(alias)
      
      baseConfig.input.plugins = [
        ...baseConfig.input.plugins,
        aliasKeys.length && aliasPlugin({
          entries: aliasKeys.map(k => ({
            find: k, replacement: alias[k]
          }))
        }),
        nodeResolve({
          browser: true,
          preferBuiltins: false
        }),
        terser()
      ]
      
      return baseConfig
    case "less":
      baseConfig = {
        input: {
          input: source,
          external: [],
          plugins: [
            less({
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

export default {
  async getAlias(project) {
    if (!project) return null
    const config = (await import('../src/config.js')).default
    const c = config.genConfig(project) || {}
    return c.alias
  },
  // 如果不是工程入口, 则新建一层项目目录并把`index.${FORMAT}.js`作为项目入口
  regenerateDest(dest, filename) {
    const reg = new RegExp(
      `(${sep}(tools|utils)${sep}index\.js|${sep}package${sep}styles${sep})`
    );
    if (!reg.test(dest)) {
      let project = filename.split('.')[0]
      dest = dest.split(path.sep)
      if (project !== 'index') {
        dest.splice(-1, 0, project)
      }
      dest[dest.length - 1] = `index.${FORMAT}.js`
      dest = dest.join(path.sep)
    }
    return dest
  },
  async genConfigs({source, dest, filename, project, format}) {
    
    const config = getConfig({
      alias: await this.getAlias(project), 
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