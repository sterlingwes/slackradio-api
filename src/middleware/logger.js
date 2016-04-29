'use strict'

const winston = require('winston')
const noop = function () {}
const testLogger = {
  info: noop,
  warn: noop,
  error: noop
}

module.exports = function (app) {
  // Add a logger to our app object for convenience
  app.logger = winston

  if (process.env.NODE_ENV === 'test') {
    app.logger = testLogger
  }

  return function (error, req, res, next) {
    if (process.env.NODE_ENV === 'test') return next(error)

    if (error) {
      const message = `${error.code ? `(${error.code}) ` : '' }Route: ${req.url} - ${error.message}`

      if (error.code === 404) {
        winston.info(message)
      } else {
        winston.error(message)
        winston.info(error.stack)
      }
    }

    next(error)
  }
}
