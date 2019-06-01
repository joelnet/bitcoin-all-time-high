export default (...list) => arg =>
  Array.prototype.reduce.call(
    list,
    (promise, next) => promise.then(next),
    Promise.resolve(arg)
  )
