var bundle = (function () {

  const _wr = function(type) {
    var orig = history[type];
    return function() {
      var rv = orig.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _wr('pushState');
  history.replaceState = _wr('replaceState');

  const routes = {};
  function routerCallback(e) {
    const path = e.state && e.state.path;
    console.log({path});
    // debugger
    if (routes['*']) {
      routes['*'](e);
    }
  }

  var _init = function _init(ctx) {
    window.addEventListener('pushState', routerCallback)
    window.addEventListener('replaceState', routerCallback)
    window.addEventListener('hashchange', routerCallback)
  }

  function _filter (path, callback) {

  }
  function _routeMatch () {}
  function Router() {
    if (!(this instanceof Router)) {
      return new Router(...arguments);
    }

    return _init(this);
  }

  Router.prototype.on = function (path, callback) {
    // const opt = {path, callback}
    if (!routes[path]) {
      routes[path] = callback
    } else {
      throw new Error(`route ${path} is already registered!`)
    }
    
  }

  Router.prototype.unlisten = function () {

  }

  return Router;




  // class Dep { // 订阅池
  //   constructor(name) {
  //     this.subs = [] //该事件下被订阅对象的集合
  //   }
  //   defined(watch) {
  //     this.subs.push(watch)
  //   }
  //   notify() { //通知订阅者有变化
  //     console.log('this.subs',this.subs)
  //     this.subs.forEach((e, i) => {
  //       if (typeof e.update === 'function') {
  //         try {
  //           e.update.apply(e) //触发订阅者更新函数
  //         } catch (err) {
  //           console.error(err)
  //         }
  //       }
  //     })
  //   }
  // }

  // class Watch {
  //   constructor(name, fn) {
  //     this.name = name; //订阅消息的名称
  //     this.callBack = fn; //订阅消息发送改变时->订阅者执行的回调函数     
  //   }
  //   add(dep) { //将订阅者放入dep订阅池
  //     dep.subs.push(this);
  //   }
  //   update() { //将订阅者更新方法
  //     var cb = this.callBack; //赋值为了不改变函数内调用的this
  //     cb(this.name);
  //   }
  // }

  // function addMethod() {
  //   let historyDep = new Dep();
  //   return function (name) {
  //     if (name === 'historychange') {
  //       return function (name, fn) {
  //         let event = new Watch(name, fn)
  //         historyDep.defined(event);
  //       }
  //     } else if (name === 'pushState' ) {
  //       let method = history[name];
  //       return function () {
  //         console.log('pushState','arguments',arguments[2])
  //         method.apply(history, arguments);
  //         historyDep.notify();
  //       }
  //     }else if ( name === 'replaceState') {
  //       let method = history[name];
  //       return function () {
  //         console.log('replaceState','arguments',arguments[2])
  //         method.apply(history, arguments);
  //         historyDep.notify();
  //       }
  //     }

  //   }
  // }
  // let addHistoryMethod = new addMethod()
  // window.addHistoryListener = addHistoryMethod('historychange');
  // history.pushState = addHistoryMethod('pushState');
  // history.replaceState = addHistoryMethod('replaceState'); 
  
  // window.addHistoryListener('history22',function(e){
  //   //注意这个方法只要路由发生变化就会被触发
  //   console.log('窗口的history改变了', e);
  //   debugger
  // })

})()

export default new bundle();
// export default bundle;
export const routerCtx = bundle;
