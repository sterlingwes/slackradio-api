'use strict'

const _ = require('lodash')
const slack = require('slack')
const hooks = require('./hooks')

var slackId, slackSecret

class Service {
  constructor (options) {
    this.options = options || {}
    this.events = ['done']
  }

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
          res(user)
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

  app.use('/slack', new Service())

  slackId = app.get('slack.id')
  slackSecret = app.get('slack.secret')

  const slackService = app.service('/slack')

  slackService.before(hooks.before)
  slackService.after(hooks.after)
}

module.exports.Service = Service
