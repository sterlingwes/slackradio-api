'use strict'

const _ = require('lodash')
const slack = require('slack')
const hooks = require('./hooks')

var slackId, slackSecret

class Service {
  constructor (app) {
    this.log = app.logger
  }

  /*
   * client completed an SSO flow with Slack and we're receiving an auth code
   * use our APP credentials with that user's code to establish an account here
   */
  create (data) {
    return new Promise((res, rej) => {
      slack.oauth.access({
        client_id: slackId,
        client_secret: slackSecret,
        code: data.code
      }, (err, response) => {
        if (err) return rej(err)
        slack.auth.test({ token: response.access_token }, (err, test) => {
          if (err) return rej(err)
          var user = _.extend(response, test)
          delete user.team
          res(user) // access_token, scope, team_id, team_name, url, user, user_id
        })
      })
    })
  }

  getChannels (data) {
    return new Promise(function (res, rej) {
      slack.channels.list(data, (err, result) => {
        if (err) return rej(err)
        res(result)
      })
    })
  }
}

module.exports = function () {
  const app = this
  const logger = app.logger

  app.use('/slack', new Service(app))

  slackId = app.get('slackId')
  slackSecret = app.get('slackSecret')

  if (process.env.NODE_ENV !== 'test') {
    if (slackId === 'SLACK_ID') logger.warn('WARNING: no SLACK_ID provided')
    if (slackSecret === 'SLACK_SECRET') logger.warn('WARNING: no SLACK_SECRET provided')
  }

  const slackService = app.service('/slack')

  slackService.on('serviceError', err => {
    logger.error('Slack:', err)
  })

  slackService.before(hooks.before)
  slackService.after(hooks.after)
}

module.exports.Service = Service
