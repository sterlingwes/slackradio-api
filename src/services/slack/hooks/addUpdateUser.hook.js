const User = require('../../../types/user.type')

function addAuthDetails (user) {
  user.email = user.user_id
  user.password = user.access_token
}

/*
 * when we authenticate with slack we're not sure
 * whether a user has already been created or whether
 * it's another slack account for the same user
 *
 * that magic happens here
 */
module.exports = function (hook) {
  const users = hook.app.service('users')
  const user = hook.params.user
  const logger = hook.app.logger

  /*
   * update existing user to ensure we don't miss
   * update tokens
   */
  if (user && user.is(hook.result)) {
    logger.info('updating existing user', user.id)
    user.updateBase(hook.result)
    return users.update(user.id, user.toJSON())
      .then(function (user) {
        return hook
      })
  /*
   * if the user isn't the one that's authenticated,
   * we're adding another slack account and should
   * link to this authenticated user
   */
  } else if (user) {
    logger.info('adding related user to', user.id)
    user.addRelated(hook.result)
    return users.update(user.id, user.toJSON())
      .then(user => {
        return hook
      })
  }

  /*
   * creating a new user, make sure we populate the
   * fields we're using as email / password
   */
  logger.info('creating new user', hook.result.user_id)
  addAuthDetails(hook.result)

  return users.create(hook.result)
    .then(function (user) {
      hook.params.user = new User(user)
      return hook
    })
}
