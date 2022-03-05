import { installModule } from '../../../dist/index.js'
import registerT from '../../../dist/package/tools/index.js'
import register from '../../../dist/package/wc/index.js'
import App from './index.jsx';
// import './dist/package/page-wc/index.js'
installModule(['icon-wc', 'tree-wc'])
const tree = [{
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
const select = () => {}

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);
