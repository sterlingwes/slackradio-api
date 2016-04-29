const Playlist = require('../../../types/playlist.type')

/*
 * if our hook has a playlist, update it - otherwise, create it
 * resolves to the newly created / updated playlist
 */
module.exports = function updatePlaylist (hook) {
  const playlists = hook.app.service('playlists')
  var hr = hook.result
  var pl
  if (hr.playlist) {
    pl = new Playlist(hr.playlist)
    var added = pl.addNext(hr.toJSON())
    if (!added) return Promise.resolve(hr.playlist)

    return playlists.update(pl._id, pl.toJSON())
      .then(playlist => {
        this.emit('songAdded', playlist)
        hook.result = playlist
        return hook
      })
  } else {
    pl = new Playlist(hr.toPlaylist())
    return playlists.create(pl.toJSON())
      .then(playlist => {
        this.emit('playlistAdded', playlist)
        hook.result = playlist
        return hook
      })
  }
}
