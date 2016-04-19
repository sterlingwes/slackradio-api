'use strict'

const path = require('path')
const NeDB = require('nedb')
const service = require('feathers-nedb')
const hooks = require('./hooks')

module.exports = function () {
  const app = this

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'playlists.db'),
    autoload: true
  })

  db.ensureIndex({
    fieldName: 'channel_id',
    unique: true
  })

  db.ensureIndex({
    fieldName: 'team_id'
  })

  let options = {
    Model: db,
    paginate: {
      default: 5,
      max: 25
    }
  }

  app.use('/playlists', service(options))

  const playlistService = app.service('/playlists')

  playlistService.after(hooks.after)
}
