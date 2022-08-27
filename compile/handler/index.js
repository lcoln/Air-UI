import fs from 'iofs'
import { matchFileFormat, matchFileName, matchProject } from '../utils/index.js'

export default async function handler (source, dest, cb) {
  if (!fs.isdir(source)) {
    // console.log({source, dest})
    let handler = null
    let code = fs.cat(source).toString()
    let filename = matchFileName(source)
    let format = matchFileFormat(source)
    let project = matchProject(source)

    try{
      handler = (await import(
        `./${['ts', 'tsx'].includes(format) ? 'js' : format}.js`)
      ).default
    } catch(e) {
      console.error(`文件${filename}编译出错, 错就错在: ${e.message}`)
    }
    // console.log({dest})

    handler && await handler({source, dest, filename, code, format, project})
  }
}
