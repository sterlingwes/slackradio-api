'use strict'

const populateUser = require('./populateUser.hook')
const addOrUpdateUser = require('./addUpdateUser.hook')

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
    addOrUpdateUser
  ],
  update: [],
  patch: [],
  remove: []
}
