'use strict'

const populateUser = require('./populateUser.hook')
const addOrUpdateUser = require('./addUpdateUser.hook')
const populateUserTeam = require('./populateUserTeam.hook')
const addUserTeam = require('./addUserTeam.hook')
const filterUser = require('./filterUser.hook')

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    populateUser,
    addOrUpdateUser,
    populateUserTeam(),
    addUserTeam(),
    filterUser
  ],
  update: [],
  patch: [],
  remove: []
}
