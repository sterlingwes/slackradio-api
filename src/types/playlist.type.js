'use strict'

const _ = require('lodash')

const keys = [
  '_id',
  'channel_id',
  'channel_name',
  'team_id',
  'team_domain',
  'started_at',
  'songs'
]

/*
 * when queueing a new song, don't add it next if the remaining time
 * on the currently playing song is <= addNextWindow
 *
 * instead, we add it after the next
 */
const addNextWindow = 20 // seconds

class Playlist {
  constructor (playlist) {
    _.extend(this, playlist)
    this.duration = 0
    this.cumulativeTime = [] // array of integers
    if (!this.songs) this.songs = []
  }

  /*
   * takes a string duration ("3:40") and turns it into seconds (int)
   */
  parseSongDuration (durationStr) {
    var time = durationStr.split(':').map(part => parseInt(part, 10))
    var seconds = 0
    seconds += time[1]
    seconds += time[0] * 60
    return seconds
  }

  /*
   * getDuration() grabs the duration of the entire playlist
   * it also sets the cumulativeTime array so we can find our spot
   */
  getDuration () {
    this.duration = this.songs.reduce((total, song) => {
      total += this.parseSongDuration(song.duration)
      this.cumulativeTime.push(total)
      return total
    }, 0)
  }

  getFirst () {
    if (!this.songs[0]) return { index: 0, remaining: 0 }
    return { index: 0, remaining: this.parseSongDuration(this.songs[0].duration) }
  }

  /*
   * getCurrent() returns info for the currently playing song
   * it also sets the started_at if the playlist wasn't previously playing
   *
   * returns { index (of song), remaining (time in seconds) }
   */
  getCurrent () {
    if (!this.started_at) {
      this.started_at = Date.now()
      return this.getFirst()
    }
    if (!this.duration) this.getDuration()

    // given the time elapsed from last started_at, find our current song slot

    var elapsedSeconds = (Date.now() - this.started_at) / 1000
    if (elapsedSeconds > this.duration) {
      elapsedSeconds = elapsedSeconds % this.duration
    }
    return this.findSong(elapsedSeconds)
  }

  /*
   * work through our cumulativeTime and find the song nearest to the time
   * that's elapsed relative to our playlist's duration & stop when we find it
   *
   * returns { index (of song), remaining (time in seconds) }
   */
  findSong (elapsed) {
    var index = 0
    var remaining = 0
    _.find(this.cumulativeTime, (songSeconds, i) => {
      index = i
      remaining = Math.ceil(songSeconds - elapsed)
      return elapsed < songSeconds
    })
    return {
      index,
      remaining
    }
  }

  /*
   * queue a song up next to the currently playing song
   */
  addNext (song) {
    var current = this.getCurrent()
    var nextIndex = current.index + 1
    if (current.remaining <= addNextWindow) nextIndex++
    this.songs.splice(nextIndex, 0, song)
  }

  toJSON () {
    return _.pick(this, keys)
  }
}

Playlist.map = function (playlist) {
  if (!playlist) return []
  return playlist.map(pl => {
    pl = new Playlist(pl)
    var currentSong = pl.getCurrent()
    return _.extend(pl.toJSON(), { current: currentSong })
  })
}

module.exports = Playlist
