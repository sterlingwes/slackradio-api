const Team = require('../../../types/team.type')

/*
 * tries to find a slack team for the authenticated user
 */
module.exports = function () {
  return function (hook) {
    const teams = hook.app.service('teams')

    return teams.find({ query: { team_id: hook.result.team_id } })
      .then(teams => {
        var team = teams.data[0]
        if (!team) return hook
        hook.params.team = new Team(team)
        return hook
      })
  }
}
