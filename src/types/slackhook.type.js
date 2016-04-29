'use strict'

const _ = require('lodash')
const keys = [
  'team_id', 'team_domain',
  'channel_id', 'channel_name',
  'user_id', 'user_name',
  'text'
]

const yturl = /<?(?:https?:\/\/)?(?:www\.)?(youtube\.com\/(v\/|embed\/|watch\?.*v=)|youtu\.be\/)((\w|-){11})(?:\S+)?>?/

class SlackWebhook {
  constructor (hook) {
    _.extend(this, _.pick(hook, keys))
  }

  matchYoutube () {
    var matches = this.text.match(yturl)
    if (matches && matches[0]) {
      this.yturl = matches[0]
        .replace(/^</, '').replace(/>$/, '')
    }
  }

  getDetailQuery () {
    if (!this.yturl) this.matchYoutube()
    return { query: { url: this.yturl } }
  }

  getPlaylistQuery () {
    return { query: { channel_id: this.channel_id } }
  }

  toPlaylist () {
    var base = _.pick(this, 'channel_id', 'channel_name', 'team_id', 'team_domain')
    base.songs = [ this.song ]
    return base
  }

  setPlaylist (playlist) {
    this.playlist = playlist
  }

  saveDetail (detail) {
    this.song = detail
  }

  validate () {
    this.matchYoutube()
    return !!this.yturl
  }

  toJSON () {
    return this.song
  }
}

module.exports = SlackWebhook
