'use strict'
const authentication = require('./authentication')
const playlist = require('./playlist')
const slack = require('./slack')
const slackHook = require('./slackhook')
const team = require('./team')
const user = require('./user')
const youtube = require('./youtube')

module.exports = function () {
  const app = this

  app.configure(authentication)
  app.configure(playlist)
  app.configure(slack)
  app.configure(slackHook)
  app.configure(team)
  app.configure(user)
  app.configure(youtube)
}
