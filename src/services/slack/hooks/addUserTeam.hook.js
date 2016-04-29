'use strict'

const Team = require('../../../types/team.type')

/*
 * handles creating slack teams in our system if they
 * don't exist along with associating users with existing
 * ones if they aren't already
 */
module.exports = function () {
  return function (hook) {
    var hookTeam = hook.params.team
    var userId = hook.result.user_id
    var teams = hook.app.service('teams')
    var logger = hook.app.logger

    if (!hookTeam) {
      logger.info('creating team', hook.result.team_id)
      var team = new Team({
        team_id: hook.result.team_id,
        team_name: hook.result.team_name,
        users: [ userId ]
      })
      return teams.create(team.toJSON())
        .then(team => {
          return hook
        })

   /*
    * if the slack team is in our system but this user
    * hasn't been added as a member, associate them
    */
    } else if (!hookTeam.hasMember(userId)) {
      logger.info('adding team member to', hookTeam.id)
      hookTeam.addMember(userId)
      return teams.update(hookTeam.id, hookTeam.toJSON())
        .then(team => {
          return hook
        })
    }
    return Promise.resolve(hook)
  }
}
