const chokidar = require('chokidar')
const { resolve } = require('./utils')
const handler = require('./handler')
const ignoreWatch = require('./config/ignore.watch.json')
const { matchFileFormat } = require('./utils')
const chalk = require('chalk')
const fs = require('iofs')

// 是否属于需要忽略监听的文件
function shouldIgnoreWatch(file) { 
  return ignoreWatch.some(item => file.match(item))
}

async function watcherBuild (file, format) {
  console.log(chalk.red(`正在编译${format}文件: ${file}`))
  let entry = file
  let output = file.replace('/src', '/dist')
  await handler(entry, output)
}
let files
let isReady

function resetParam() {
  files = {
    js: [],
    less: [],
    wc: []
  }
  isReady = false
}

resetParam()

function watcher () {
  return new Promise((yes, no) => {
    chokidar
      .watch(resolve('src'))
      .on('all', async (act, filepath) => {
        // 暂无做删除处理, 后期加上
        if (act === 'unlink') return
        if (!fs.isdir(filepath) && !shouldIgnoreWatch(filepath)) {
          let format = matchFileFormat(filepath)
          if (isReady) {
            await watcherBuild(filepath, format)
          } else {
            files[format] && files[format].push(filepath)
          }
          // await watcherBuild(filepath, format)
        }
      })
      .on('ready', async () => {
        for (let it of Object.keys(files)) {
          console.log(chalk.yellow(`**************** ${it}编译 ****************`))
          await Promise.all(files[it].map(async file => {
            await watcherBuild(file, it)
          }));
          files[it].map(file => {
            watcherBuild(file, it)
          })
        }
        resetParam()
        if (process.env.ENV !== 'DEV') process.exit()
        console.log('监听文件变化中,请勿关闭本窗口...')
        yes()
      })
  })
}

(function () {
  process.nextTick(async () => await watcher())
})()
