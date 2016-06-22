'use strict'

const handler = require('feathers-errors/handler')
const notFound = require('./not-found-handler')

module.exports = function () {
  const app = this

  app.use(handler())
  app.use(notFound())
}
