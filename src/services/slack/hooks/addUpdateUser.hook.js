module.exports = function (hook) {
  const users = hook.app.service('users')

  if (hook.result._user) {
    var id = hook.result._user._id
    delete hook.result._user
    return users.update(id, hook.result)
      .then(function (user) {
        hook.result = user
        return hook
      })
  }

  return users.create(hook.result)
    .then(function (user) {
      return hook
    })
}
