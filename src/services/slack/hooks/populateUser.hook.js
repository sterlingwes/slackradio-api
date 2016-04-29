'use strict'

const User = require('../../../types/user.type')

module.exports = function (hook) {
  hook.app.logger.info('slack auth', hook.result)
  var userId = hook.result.user_id
  return hook.app.service('users').find({ query: { user_id: userId } })
    .then(function (users) {
      var user = users.data[0]
      if (!user) return hook
      hook.params.user = new User(user)
      return hook
    })
}
