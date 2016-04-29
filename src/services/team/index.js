'use strict'

const path = require('path')
const NeDB = require('nedb')
const service = require('feathers-nedb')
const hooks = require('./hooks')

module.exports = function () {
  const app = this

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'teams.db'),
    autoload: true
  })

  let options = {
    Model: db,
    paginate: {
      default: 5,
      max: 25
    }
  }

  app.use('/teams', service(options))

  const teamService = app.service('/teams')

  teamService.before(hooks.before)
  teamService.after(hooks.after)
}
