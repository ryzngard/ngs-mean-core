const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const team = new Schema({
    "id": String,
    "teamName": String,
    "score": Number,
    "dominator": Boolean
}, {
    strict: false
});

const scheduleSubSchema = new Schema({
    "priorScheduled": Boolean,
    "startTime": String,
    "endTime": String
}, {
    strict: false
});

const replaySchema = new Schema({
    "1": {
        "url": String,
        "data": String
    },
    "2": {
        "url": String,
        "data": String
    },
    "3": {
        "url": String,
        "data": String
    },
    "4": {
        "url": String,
        "data": String
    },
    "5": {
        "url": String,
        "data": String
    }
}, { strict: false });

const matchSchema = new Schema({
    "matchId": String,
    "season": Number,
    "division": String,
    "divisionConcat": String,
    "round": Number,
    "home": team,
    "away": team,
    "scheduledTime": scheduleSubSchema,
    "replays": replaySchema,
    "casterName": String,
    "type": String,
    "name": String,
    "parentId": String,
    "idChildren": [String],
    "casterUrl": String,
    "mapBans": Object,
    "other": Object,
    "reported": Boolean,
    "scheduleDeadline": String
}, { useNestedStrict: false });


const Match = mongoose.model('match', matchSchema);

module.exports = Match;