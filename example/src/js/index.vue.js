import { installWC } from '../../../dist/index.js'

installWC([{
  name: 'tree-wc',
  config: {
    mode: 'hash',   // hash
  }
}, 'icon-wc'], {framework: 'vue'})
var baseUrl = 'http://localhost/tech/web-component/example/index.html'
var app = new Vue({
  el: '#app',
  data () {
    var _this = this
    return {
      msg: 'Hello Vue!',
      tree: [{
        title: '入门教程',
        childs: [{
          title: '安装',
          path: 'install'
        }, {
          title: '使用',
          path: 'api'
        }]
      }, {
        title: 'Components',
        childs: [{
          title: 'Navigation(导航类)',
          path: 'tree',
          childs: [{
            title: 'Page',
            path: 'page',
          },{
            title: 'Tree',
            path: 'tree'
          }]
        }]
      }]
    }
  },
  methods: {
    select (ev) {
      console.log(ev)
      this.msg = 'Tree'
    }
  },
  mounted () {

  }
})