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

  /*
   * songAdded: event fired when a new song is added to an existing playlist
   *
   * here we're filtering so we only send the event to those users who
   * are eligible to receive pushes for the slack team for the event in question
   */
  slackhookSvc.filter('songAdded', function (data, connection, hook) {
    var user = connection.user
    if (!user) return false
    var playlist = data.length ? data[0] : data
    if (user.teams.indexOf(playlist.team_id) === -1) {
      hook.app.logger.info('ignoring songAdded: team mismatch', connection.user._id, playlist.team_id)
      return false
    }
    return data
  })

  slackhookSvc.after(hooks.after)
}

module.exports.Service = Service
