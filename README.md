# Air-UI

>1. 一个基于rollup搭建的, 参考开源框架<a href="https://github.com/bytedo/wcui" target="_blank">wcui</a>, 集成web-component组件库, js插件, 主题库的微型开发框架
>2. 寓意是希望能打造一款像空气一样轻, 无杂质(不花里胡哨), 并且能成为刚需(很狂哈哈哈~)的组件工具库

# 为什么
>1. 技术沉淀, 需要载体进行承载, 而载体, 能带来统一规范, 有利于库的不断扩展, 不断为业务输血
>2. 市场上众多第三方库, 虽比较实用, 但需要满足大多数场景下的使用, 所以集成较多功能, 较为臃肿。本框架旨在打造轻量级实用的依赖库
>3. 可以无视框架, 无缝嵌入任意vue/react/angular/anot/jquery/native js项目上
>4. 未雨绸缪, 开发无框架组件的同时也可以开发js插件, 主题库

## 开发环境及生产环境
``` bash
# 安装依赖
npm install

# 开发环境
npm run dev 

# 生产环境
npm run build:<format> // amd、cjs、esm、iife、umd、system, 默认esm

# 本地预览
npm run build:<format> // amd、cjs、esm、iife、umd、system, 默认esm
```
## 本地预览
``` nginx
// 配置ngnix
server {
  listen     80;
  root	     /path/to/airui/dist;
  index	     index.html;
}
http://localhost/path/to/airui/dist/index-vue.html
```

## 规范
>1. 主题库的设计需根据ui规范来
>2. js插件默认以esm格式打包输出
>3. 使用wc组件
  >>- 生命周期: mount(组件挂载时), unmount(组件卸载时), watch(组件更新时), adopted(组件移动至不同页面时)
  >>- 通过在html中<script type="module" src="xx-wc/index.js" crossorigin></script>来引入,
  >>- 在第三方框架项目中直接import引入
  >>- 通过<xx-wc props={}></xx-wc>使用
  >>- 组件样式命名, .air-ui-<组件名> { .<组件名>-<组件内部组成> {} }

## 目录概述
``` bash
├── README.md
├── compile         // 编译脚本目录
│   ├── build.js    // 改版前遗留问题, 先留存备份
│   ├── config
│   │   └── ignore.watch.json     // 不需要监控的文件列表
│   ├── handler     // 不同format文件的编译脚本
│   │   ├── index.js
│   │   ├── js.js
│   │   ├── less.js
│   │   └── wc.js
│   ├── index.js
│   ├── rollup.config.js    // 不同format文件rollup配置统一管理
│   └── utils       // 编译脚本通用的函数库
│       ├── date.js
│       └── index.js        // 部分代码为改版前遗留问题, 先留存备份
├── dist            // 打包输出目录
│   ├── index.js
│   └── package
│       ├── styles
│       ├── tools
│       ├── utils
│       └── wc
├── example         // 举个🌰
│   ├── index.html
│   └── src
│       ├── css
│       └── js
├── package-lock.json
├── package.json
├── src             // 本地开发目录
│   ├── config.js   // 打包配置, 目前暴露了alias参数处理, 同webpack resolve.alias
│   ├── index.js
│   └── package
│       ├── styles  // 主题库
│       ├── tools   // 函数库
│       ├── utils   // 本地开发需要通用的工具库
│       └── wc      // wc组件库
└── yarn.lock
```

## 开发进度&计划
- [ ] 增加wc组件的render生命周期
- [ ] 增加对tools/*.js的压缩混淆
- [ ] 在线文档
- [ ] 组件-按钮(`wc-button`)
- [ ] 组件-单选框(`wc-radio`)
- [ ] 组件-下拉选择(`wc-select`)
- [ ] 组件-日期选择器(`wc-datepicker`)
- [x] 组件-树形菜单(`wc-tree`)
- [x] 组件-分页(`wc-page`)
- [ ] 组件-上传(`wc-upload`)
- [x] 函数-吸顶(`sticky`)
- [ ] 函数-前端路由(`router`)
- [x] 函数-资源请求(`load-assets`)
- [x] 函数-网络请求(`fetch`)
- [x] 函数-页面自适应(`rem-adapter`)
- ...


## 感谢

>- 灵感来源: <a href="https://github.com/bytedo/wcui" target="_blank">wcui</a>
>- 打包技术栈: <a href="https://rollupjs.org/guide/en/" target="_blank">rollup</a>
>- less生态: <a href="https://lesscss.org/" target="_blank">less</a>
>- wc官方生态: <a href="https://developer.mozilla.org/zh-CN/docs/Web/Web_Components" target="_blank">Web Components</a>
>- 模块化: <a href="https://betterprogramming.pub/what-are-cjs-amd-umd-esm-system-and-iife-3633a112db62" target="_blank">amd、cjs、esm、iife、umd、system模块化区别</a>
