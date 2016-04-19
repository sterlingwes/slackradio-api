const parse = require('./parse.hook')
const hydrate = require('./hydrate.hook')
const playlist = require('./playlist.hook')

module.exports = {
  after: {
    create: [
      parse,
      hydrate,
      playlist
    ]
  }
}
