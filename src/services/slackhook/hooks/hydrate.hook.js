/*
 * with a valid slack webhook, find a related playlist and
 * fetch the song detail
 */
module.exports = function hydrate (hook) {
  var response = { invalid: true }
  if (hook.result.validate()) {
    var hr = hook.result
    return hook.app.service('playlists').find(hr.getPlaylistQuery())
      .then(playlists => {
        if (playlists.data.length) {
          var playlist = playlists.data[0]
          hr.setPlaylist(playlist)
        }
        return fetchDetail(hook)
      })
  }
  hook.result = response
  return Promise.resolve(hook)
}

/*
 * fetching meta detail for the provided media
 */
function fetchDetail (hook) {
  return hook.app.service('youtube').find(hook.result.getDetailQuery())
    .then(function (detail) {
      hook.result.saveDetail(detail)
      return hook
    })
}
