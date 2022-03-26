/*
 * @Description: 
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-03-26 15:19:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-26 15:35:43
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { getOptions } = require("loader-utils");

let importList = [];

// 如果是忽略扫描的文件或者目录则跳过
function getSourceConfig(source) {
  return {
    isIgnore(pagePath) {
      if (source.ignore.some(a => new RegExp(a).test(pagePath))) {
        return true;
      }
      return false;
    },
    replace(pagePath) {
      return source.replace[pagePath] || pagePath;
    }
  }
}

function md5(prefix, path) {
  return `${prefix}_${crypto.createHash('md5').update(path).digest('hex')}`;
}

// window路径兼容
function resolve(...rest) {
  let result = '';
  // eslint-disable-next-line no-unused-vars
  for (const it of [...new Set(rest)].flat()) {
    result = path.resolve(result, it);
  }
  return result.replace(/\\/g, '\\\\');
}

function createName(dir) {
  return `name: '${dir.slice(dir.lastIndexOf('/') + 1)}', \n`;
}

// 添加父级组件路径
function createParent(dir) {
  let parent = dir.slice(0, dir.lastIndexOf('/'));
  if (fs.existsSync(resolve([...parent, 'index.(j|t)sx']))) {
    return `parent: '${resolve([...parent, 'index.(j|t)sx'])}', \n`;
  } else if (fs.existsSync(resolve([...parent, 'layout.(j|t)sx']))) {
    return `parent: '${resolve([...parent, 'layout.(j|t)sx'])}', \n`;
  }
  return '';
}

// 添加当前路由对应component
function createComponent(absPath) {
  return `component: () => import(/* webpackPrefetch: true */ "${absPath}"), \n`;
}

// 添加当前路由对应config
function createConfig(c) {
  return `config: typeof ${c} === 'function' ? ${c}() : ${c}, \n`;
}

// 添加当前路由对应context
function createContext(c) {
  return `context: ${c}, \n`;
}

// 添加当前路由对应布局组件
function createLayout(absPath) {
  return `layout: () => import(/* webpackPrefetch: true */ "${absPath}"), \n`;
}

// 添加当前路由对应路径
function createPath(routerPath, level, replace) {
  let p = routerPath.split('/').slice(-level);
  p.pop();
  const curPath = replace('/' + p.join('/'));
  return `path: '${curPath}', \n`;
}

function createPageConfig({isIgnore, replace}, dir, level = 1) {

  let result = `{level: ${level}, \n`;
  let children = ``;

  if (fs.statSync(dir).isDirectory()) {
    let content = fs.readdirSync(dir);
    let contentCopy = JSON.parse(JSON.stringify(content));
    let hasPath = false;
    let hasName = false;
    while (content.length) {
      let cur = content.shift();
      let absPath = resolve(fs.realpathSync(dir), cur);
      let routerPath = `${fs.realpathSync(dir)}/${cur}`;
      // window系统做下路径兼容
      if (path.sep !== '/') {
        routerPath = routerPath.replace(/\\/g, '/').slice(2);
      }
      if (isIgnore(absPath)) {
        continue;
      }

      // 如果当前路径是目录并且目录名不是components
      if (fs.statSync(absPath).isDirectory() && !/components$/.test(cur)) {
        children += createPageConfig({isIgnore, replace}, absPath, level + 1) + ', \n';
      // 如果当前路径是index.j|tsx, 则当作路由的component
      } else if (/index\.(j|t)sx$/.test(cur)) {
        !hasName && (result += createName(dir));
        !hasPath && (result += createPath(routerPath, level, replace));
        result += createParent(dir);
        result += createComponent(absPath);
        hasName = true;
        hasPath = true;

      // 如果当前路径是_config.j|tsx, 则当作路由的config挂载
      } else if (/_config\.(js|ts|(j|t)sx)$/.test(cur)) {
        let c = md5('config', absPath);
        importList.push(`import ${c} from '${absPath}'`);
        result += createConfig(c);
      // 如果当前路径是layout.j|tsx, 则当作路由的布局组件
      } else if (/layout\.(j|t)sx$/.test(cur)) {
        !hasName && (result += createName(dir));
        !hasPath && (result += createPath(routerPath, level, replace));
        result += createLayout(absPath);
        hasName = true;
        hasPath = true;
        // 如果当前路径是_context.j|tsx, 则当作路由的context
      } else if (/_context\.(j|t)sx$/.test(cur)) {
        let c = md5('context', absPath);
        importList.push(`import ${c} from '${absPath}'`);
        result += createContext(c);
      }
    }

    result += `children: [${children}], \n`;
    result += `id: '${md5('', dir)}',}`;
    if (!contentCopy.some(v => /\.(j|t)sx$/g.test(v))) {
      result = children.replace(/level: (\d)/g, function($1, $2){
        return `level: ${$2 - 1}`;
      }).replace(/^\[/, function(){
        return '';
      }).replace(/\]$/, function(){
        return '';
      })
    } 
  }
  return result;
}

module.exports = function (source) {
  const options = this?.getOptions() || getOptions(this) || {};
  importList = [];
  let result = source;
  try {
    result = JSON.parse(result);
    result.replace = Object.keys(result.replace).reduce((item, next) => {
      item[next.split('/').join(path.sep)] = result.replace[next].split('/').join(path.sep);
      return item;
    }, {});
    result.ignore = result.ignore.map(v => v.split('/').join(path.sep));
  } catch (e) {
    console.log(e);
  }
  const pagesPath = options.pagesPath || path.resolve(this.context, '..', 'pages');
  
  let exportCollect = createPageConfig(
    getSourceConfig(result),
    pagesPath
  ).slice(0, -1) + `\n}`;

  exportCollect = `export const pageRouter = ${exportCollect}\nexport const pageConfig = ${JSON.stringify(result)}`;
  let importCollect = importList.join ? importList.join(';') : '';
  this.addContextDependency(this.context);
  this.addDependency(this.context);
  
  const callback = this.async();

  ;(async () => {
    callback(null, `${importCollect};\n${exportCollect}`);
  })();
}