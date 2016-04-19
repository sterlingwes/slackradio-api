'use strict'

const ytdl = require('youtube-dl')
const _ = require('lodash')

const ytKeys = [
  'id',
  'ext',
  'title', 'fulltitle',
  'creator',
  'duration',
  'extractor',
  'thumbnail',
  'webpage_url'
]

function shrink (hook) {
  hook.result = _.pick(hook.result, ytKeys)
  return Promise.resolve(hook)
}

class Service {
  constructor (options) {
    this.options = options || {}
    this.events = ['done']
  }

  find (params) {
    var url = params.query.url
    var video = ytdl(url, ['--simulate', '--extract-audio'])
    return new Promise((res, rej) => {
      video.on('info', res)
      video.on('error', rej)
    })
  }
}

module.exports = function () {
  const app = this

  app.use('/youtube', new Service())

  const ytService = app.service('/youtube')

  ytService.after({
    find: [
      shrink
    ]
  })
}

module.exports.Service = Service
