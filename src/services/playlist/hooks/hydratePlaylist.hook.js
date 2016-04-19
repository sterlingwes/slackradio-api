const Playlist = require('../../../types/playlist.type')

module.exports = function () {
  return function (hook) {
    if (hook.result.data) {
      hook.result.data = Playlist.map(hook.result.data)
    } else {
      hook.result = Playlist.map([ hook.result ])
    }
    return Promise.resolve(hook)
  }
}
