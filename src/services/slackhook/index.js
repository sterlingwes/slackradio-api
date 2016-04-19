'use strict'

const hooks = require('./hooks')

class Service {
  constructor (options) {
    this.options = options || {}
    this.events = ['songAdded', 'playlistAdded']
  }

  create (data) {
    return Promise.resolve(data)
  }
}

module.exports = function () {
  const app = this

  app.use('/slackhook', new Service())

  const slackhookSvc = app.service('/slackhook')

  slackhookSvc.after(hooks.after)
}

module.exports.Service = Service
