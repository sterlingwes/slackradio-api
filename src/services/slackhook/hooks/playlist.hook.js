const Playlist = require('../../../types/playlist.type')

/*
 * if our hook has a playlist, update it - otherwise, create it
 * resolves to the newly created / updated playlist
 */
module.exports = function updatePlaylist (hook) {
  const playlists = hook.app.service('playlists')
  var hr = hook.result
  if (hr.hasPlaylist()) {
    return playlists.get(hr.playlist_id)
      .then(playlist => {
        playlist = playlist[0]
        var pl = new Playlist(playlist)
        pl.addNext(hr.toJSON())
        return playlists.update(playlist._id, pl.toJSON())
      })
      .then(playlist => {
        hook.result = playlist
        return hook
      })
  } else {
    var pl = new Playlist(hr.toPlaylist())
    return playlists.create(pl.toJSON())
      .then(playlist => {
        hook.result = playlist
        return hook
      })
  }
}
