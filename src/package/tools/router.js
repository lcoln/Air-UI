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

})()

export default new bundle();
// export default bundle;
export const routerCtx = bundle;
