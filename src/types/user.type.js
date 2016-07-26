'use strict'

const _ = require('lodash')

class SlackUser {
  constructor (user) {
    this.o = user
    if (!this.o.users) this.o.users = []
    if (!this.o.teams) this.o.teams = []
    this.id = user._id
  }

  addRelatedUser (userId) {
    if (this.o.users.indexOf(userId) !== -1) return
    this.o.users.push(userId)
  }

  addRelatedTeam (teamId) {
    if (this.o.teams.indexOf(teamId) !== -1) return
    this.o.teams.push(teamId)
  }

  addRelated (user) {
    this.addRelatedUser(user.user_id)
    this.addRelatedTeam(user.team_id)
  }

  updateBase (user) {
    user.password = user.access_token
    _.extend(this.o, user)
  }

  is (user) {
    return this.o.user_id === user.user_id
  }

  toPublic () {
    return _.pick(this.o, 'access_token', 'user_id')
  }

  toJSON () {
    return this.o
  }
}

module.exports = SlackUser
