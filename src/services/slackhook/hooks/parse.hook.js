const SlackHook = require('../../../types/slackhook.type')

/*
 * take an incoming slack webhook payload and parse the
 * important parts
 */
module.exports = function parsePayload (hook) {
  hook.result = new SlackHook(hook.result)
  return Promise.resolve(hook)
}
