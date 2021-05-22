var bundle = (function () {
  var PENDING = 'pending'
  var FULFILLED = 'fulfilled'
  var REJECTED = 'rejected'

  function Promise () {
    this.state = PENDING
    this.result = null
    this.callback = []
  }
  function transition (promise, state, result) {
    if (promise.state !== PENDING) return
    promise.state = state
    promise.result = result
  }
  Promise.prototype.then = function (onFulfilled, onRejected) {
    return function () {

    }
  }

  return promise
})()
.then(res => {

}, err => {
  
})