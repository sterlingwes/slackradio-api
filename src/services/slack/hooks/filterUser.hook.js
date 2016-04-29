/*
 * make sure we only send public-friendly user
 * deets to the client
 */
module.exports = function (hook) {
  hook.result = hook.params.user.toPublic()
  hook.app.logger.info('returning', hook.result)
  return Promise.resolve(hook)
}
