const path = require('path')

module.exports = {
  genConfig(project){
    return {
      alias: {
        "@": path.resolve(__dirname, project)
      }
    }
  }
}