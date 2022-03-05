const fs = require('iofs')
const { matchFileFormat, matchFileName, matchProject } = require('../utils')

module.exports = async function handler (source, dest, cb) {
  if (!fs.isdir(source)) {
    // console.log({source, dest})
    let handler = null
    let code = fs.cat(source).toString()
    let filename = matchFileName(source)
    let format = matchFileFormat(source)
    let project = matchProject(source)

    try{
      handler = require(`./${format === 'ts' ? 'js' : format}.js`)
    } catch(e) {
      console.error(`文件${filename}编译出错, 错就错在: ${e.message}`)
    }

    handler && await handler({source, dest, filename, code, format, project})
  }
}
