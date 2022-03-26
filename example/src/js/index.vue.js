import { installModule } from '../../../dist/index.js'

installModule(['icon-wc', 'tree-wc'])
var baseUrl = 'http://localhost/tech/web-component/example/index.html'
var app = new Vue({
  el: '#app',
  data () {
    var _this = this
    return {
      msg: 'Hello Vue!',
      tree: [{
        title: '入门教程',
        link: '',
        childs: [{
          title: '安装',
          link: ''
        }, {
          title: '使用',
          link: ''
        }]
      }, {
        title: 'Components',
        link: '',
        childs: [{
          title: 'Navigation(导航类)',
          link: '#!tree',
          childs: [{
            title: 'Page',
            link: '#!page',
            tag: '<div>test</div>'
          },{
            title: 'Tree',
            link: '#!tree'
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