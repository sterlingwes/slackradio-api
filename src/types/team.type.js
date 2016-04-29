'use strict'

class Team {
  constructor (team) {
    this.o = team
    this.id = team._id
  }

  hasMember (userId) {
    return this.o.users.indexOf(userId) !== -1
  }

  addMember (userId) {
    this.o.users.push(userId)
  }

  toJSON () {
    return this.o
  }
}

module.exports = Team
