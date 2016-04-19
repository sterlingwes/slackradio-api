module.exports = function (hook) {
  var userId = hook.result.user_id
  return hook.app.service('users').find({ user_id: userId })
    .then(function (users) {
      var user = users.data[0]
      if (!user) return hook
      hook.result = Object.assign({}, hook.result, { _user: user })
      return hook
    })
}
