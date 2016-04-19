const hydrate = require('./hydratePlaylist.hook')

module.exports = {
  after: {
    all: [
      hydrate()
    ]
  }
}
