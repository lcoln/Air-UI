import buildURL from './buildURL';
const t = function() {
  // if (window.fetch) {
  //   return window.fetch
  // }
  const methods = ["post", "get", "put", "delete", "patch"];
  const noop = function noop() {};
  var _isString = function _isString (obj) {
    return Object.prototype.toString.call(obj) === '[object String]'
  }
  var _isFile = function _isFile(obj) {
    return obj instanceof FormData 
      && Object.prototype.toString.call(obj) === "[object FormData]"
  }

  // 设置header
  var _headerEmit = function _headerEmit(_instance, headers = {}) {
    const hearderKeys = Object.keys(headers);
    if (hearderKeys.length) {
      for (let i = 0; i < hearderKeys.length; i++) {
        _instance.setRequestHeader(hearderKeys[i], headers[hearderKeys[i]]);
      }
    }
  };
  // 参数序列化
  var _paramSerialize = function _paramSerialize(method, param, url) {
    if (method === 'get') {
      param = param.params ? param.params : param
      return buildURL(url, param)
    }
    return url
  }

  // 监听事件处理
  var _evEmit = function _evEmit(ctx, _instance, instanceKey) {
    const { _evList, _config } = ctx;
    if (_evList.length) {
      for (let i = 0; i < _evList.length; i++) {
        _instance.upload.addEventListener(_evList[i].evName, ev => {
          _evList[i].callback(ev.target);
        });
      }
    }
    // 处理timeout
    if (_config.timeout) {
      _instance.addEventListener("timeout", () => {
        _clearContext(ctx, instanceKey);
        _instance.abort();
      });
    }
  };

  var _clearContext = function _clearContext(ctx, url) {
    delete ctx._requestQueue[url];
  };
  var _createContext = function _createContext(ctx, url, body, config) {
    const _instance = new XMLHttpRequest();
    _instance.timeout =
      config && config.timeout
        ? config.timeout
        : ctx._config.timeout
        ? ctx._config.timeout
        : "";
    if (!ctx._requestQueue[url]) {
      ctx._requestQueue[url] = [_instance];
    } else {
      ctx._requestQueue[url].push(_instance);
    }
    return _instance;
  };

  var _init = function _init(ctx) {
    const _this = ctx;
    for (let i = 0; i < methods.length; i++) {
      Fetch.prototype[methods[i]] = (uri, body = {}, config = {}) => {
        let instanceKey = _this._baseUrl + uri
        let realUrl = _this._baseUrl + uri 
        if (/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(uri)) {
          instanceKey = uri;
          realUrl = uri
        }

        try {
          instanceKey += JSON.stringify(body)
        } catch(e) {console.log(e)}
        // 获取当前xhr实例
        let _instance = _this.getContext(instanceKey, "currInstance");

        // 取消重复请求
        if (_instance && _this._config.forbidRepeatRequest) {
          _instance.abort();
          _clearContext(_this, instanceKey);
        }

        // 创建网络连接实例
        _instance = _createContext(_this, instanceKey, body, config);

        // 给实例挂载事件监听方法
        _evEmit(_this, _instance, instanceKey);

        // 序列请求化参数
        const requestUrl = _paramSerialize(methods[i], body, realUrl)
        // 开启服务
        _instance.open(methods[i].toLocaleUpperCase(), requestUrl);

        let _config = {
          body,
          headers: Object.clone(_this._headers)
        };
        // 请求前对请求参数、header等进行拦截
        if (_this._onRequestYes) {
          _config = _this._onRequestYes(_config) || _config;
        }
        // console.log(_this._headers, 11111111)
        Object.assign(_config.headers, config.headers || {})
        // 如果上传文件，则添加文件的contentType
        if (_isFile(_config.body)) {
          // Object.assign(_config.headers, {
          //   'content-type': 'application/octet-stream;multiple/form-data',
          // })
          delete _config.headers['content-type']
        } else {
          _config.body = JSON.stringify(_config.body)
        }
        // console.log(_config.headers, 2222222)

        // 设置header
        _headerEmit(
          _instance,
          _config.headers
        );

        // 发送请求
        _instance.send(_config.body);

        return new Promise(yes => {

          // 处理取消请求
          if (typeof config.cancel === 'function') {
            try {
              config.cancel(function() {
                _instance.abort();
                yes && yes({code: 499, msg: 'Client close request'})
                yes = null
              })
            } catch (e) {}
          }

          _instance.onload = function(response) {
            _clearContext(_this, instanceKey);
            let { status, responseText = {}, statusText } = response.target;

            try {
              responseText = JSON.parse(responseText);
              // eslint-disable-next-line no-empty
            } catch (e) {}

            let res = null;
            let tmpResponse = {
              data: responseText,
              response: {
                status,
                statusText
              },
              config: _config
            };
            if (status >= 400) {
              res = _this._onResponseNo(JSON.parse(JSON.stringify(tmpResponse)))
               || responseText;
            } else {
              res = _this._onResponseYes(JSON.parse(JSON.stringify(tmpResponse)))
               || responseText;
            }
            // if (_isString(res.data)) {
            //   res.data = {
            //     code: status,
            //     msg: res.data
            //   }
            // }
            // console.log({res, responseText, response, tmpResponse}, '3456789')

            // try {
            //   Object.assign(responseText, res);
            //   // eslint-disable-next-line no-empty
            // } catch (e) {}
            delete res.response;
            // console.log({res})
            yes && yes(res)
            yes = null
          };
        });
      };
    }
    return _this;
  };

  function Fetch(baseUrl, config) {
    if (!(this instanceof Fetch)) {
      return new Fetch(...arguments);
    }
    this._baseUrl = baseUrl;
    this._config = config
      ? Object.assign(
          {
            forbidRepeatRequest: true
          },
          config
        )
      : { forbidRepeatRequest: true };
    this._requestQueue = {};
    this._evList = [];
    this._headers = this._config.headers || { "content-type": "application/json; charset=utf-8" };
    // this._headers = {  };

    return _init(this);
  }

  // 请求前参数拦截
  Fetch.prototype.onRequest = function({ yes = noop, no = noop }) {
    this._onRequestYes = yes;
    this._onRequestNo = no;
    return this;
  };

  // 请求返回结果前拦截
  Fetch.prototype.onResponse = function({ yes = noop, no = noop }) {
    this._onResponseYes = yes;
    this._onResponseNo = no;
    return this;
  };

  // 请求事件监听
  // onabort, onerror, onload, onloadstart, onprogress
  Fetch.prototype.on = function(evName, callback) {
    this._evList.push({
      evName,
      callback
    });
    return this;
  };

  // 请求的实例
  // instances 实例集合
  // currInstance 当前最后一个请求实例
  // abort 取消请求 
  Fetch.prototype.getContext = function(url, key) {
    const _this = this;

    if (!/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(url)) {
      url = this._baseUrl + url
    }
    // console.log({url})
    const ctx = {
      instances: _this._requestQueue[url],
      currInstance:
        _this._requestQueue[url] && _this._requestQueue[url].slice(-1)[0],
      abort() {
        let queue = _this._requestQueue[url];
        // console.log({url}, _this._requestQueue)
        if (queue) {
          if (Object.prototype.toString.call(queue) !== "[object Array]") {
            queue = [queue];
          }
          for (let i = 0; i < queue.length; i++) {
            if (queue[i] instanceof XMLHttpRequest) {
              // console.log({queue}, _this._requestQueue)
              queue[i].abort();
            }
          }
        }
      }
    };
    return key ? ctx[key] : ctx;
  };
  Fetch.prototype.constructor = Fetch;
  return Fetch;
};
export default t();
