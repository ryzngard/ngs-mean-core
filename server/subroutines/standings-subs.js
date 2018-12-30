const Match = require('../models/match-model');
const util = require('../utils');
const Team = require('../models/team-models');

async function calulateStandings(division) {
    let teams;
    // console.log('a ', division);
    let matchesForDivision = await Match.find({ divisionConcat: division }).lean().then(
        (matches) => {
            // console.log('b ', matches);
            if (matches) {
                // console.log('b.1 ')
                teams = findTeamIds(matches);
                // console.log('b.2 ', teams)
                return addTeamNamesToMatch(teams, matches).then(
                    (processed) => {
                        // console.log('b.3 ', processed)
                        return processed;
                    },
                    (err) => {
                        // console.log('b.4 ', err)
                        return false;
                    }
                )
            } else {
                // console.log('b.5 ')
                return false;
            }
        },
        (err) => {
            // console.log('b.6 ', err)
            return false;
        }
    );
    // console.log('matchesForDivision ', matchesForDivision);
    let standings = [];
    if (matchesForDivision != false) {
        // console.log('c');
        teams.forEach(team => {
            // console.log('c.1 ', team);
            let standing = {};
            standing['wins'] = 0;
            standing['losses'] = 0;
            standing['id'] = team;
            matchesForDivision.forEach(match => {
                if (match.away.id == team) {
                    standing['teamName'] = match.away.teamName;
                    let score = match.away.score
                    if (score) {
                        if (score == 2) {
                            standing['wins'] += 2;
                        } else if (score == 1) {
                            standing['wins'] += 1;
                            standing['losses'] += 1;
                        } else {
                            standing['losses'] += 2;
                        }
                    }
                } else if (match.home.id == team) {
                    standing['teamName'] = match.home.teamName;
                    let score = match.home.score
                    if (score) {
                        if (score == 2) {
                            standing['wins'] += 2;
                        } else if (score == 1) {
                            standing['wins'] += 1;
                            standing['losses'] += 1;
                        } else {
                            standing['losses'] += 2;
                        }
                    }
                }
            });
            // console.log('c.z ', standing);

            standings.push(standing);
        });
    }
    standings.sort((a, b) => {
        if (a.wins > b.wins) {
            return true;
        } else {
            return false;
        }
    });
    for (var i = 0; i < standings.length; i++) {
        standings[i]['standing'] = i + 1;
    }
    return standings;
}

function findTeamIds(found) {
    let teams = [];
    //type checking make sure we have array
    if (!Array.isArray(found)) {
        found = [found];
    }

    found.forEach(match => {
        if (util.returnBoolByPath(match, 'home.id')) {
            if (match.home.id != 'null' && teams.indexOf(match.home.id.toString())) {
                teams.push(match.home.id.toString());
            }
        }
        if (util.returnBoolByPath(match, 'away.id')) {
            if (match.away.id != 'null' && teams.indexOf(match.away.id.toString())) {
                teams.push(match.away.id.toString());
            }
        }
    });
    return teams;
}

async function addTeamNamesToMatch(teams, found) {
    //typechecking
    if (!Array.isArray(found)) {
        found = [found];
    }
    return Team.find({
        _id: {
            $in: teams
        }
    }).then((foundTeams) => {
        if (foundTeams) {
            foundTeams.forEach(team => {
                let teamid = team._id.toString();
                found.forEach(match => {
                    let homeid, awayid;
                    if (util.returnBoolByPath(match, 'home.id')) {
                        homeid = match.home.id.toString();
                    }
                    if (util.returnBoolByPath(match, 'away.id')) {
                        awayid = match.away.id.toString();
                    }
                    if (teamid == homeid) {
                        match.home['teamName'] = team.teamName;
                        match.home['teamName_lower'] = team.teamName_lower;
                    }
                    if (teamid == awayid) {
                        match.away['teamName'] = team.teamName;
                        match.away['teamName_lower'] = team.teamName_lower;
                    }
                });
            });
            return found;
        } else {
            return [];
        }
    }, (err) => {
        return err;
    });
}

module.exports = {
    calulateStandings: calulateStandings
};