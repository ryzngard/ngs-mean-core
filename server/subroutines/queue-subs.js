const Admin = require('../models/admin-models');
const util = require('../utils');

function cleanUpPendingQueue(item) {
    Admin.PendingQueue.findByIdAndDelete(item._id).then((deleted) => {
        console.log('pendingQueue item ' + deleted._id + ' deleted.');
    }, (err) => {
        console.log('err in the pending delete sub ', err);
    })
}

function cleanUpPendingQueueTeamnameUsername(teamname, username) {
    Admin.PendingQueue.findOneAndDelete({ teamName: teamname, userName: username }).then((deleted) => {
        console.log('pendingQueue item ' + deleted._id + ' deleted.');
    }, (err) => {
        console.log('err in the pending delete sub ', err);
    })
}

function addToPendingTeamMemberQueue(teamLower, user) {
    if (util.isNullorUndefined(teamLower) && util.isNullorUndefined(user)) {
        //persistent logging of errors in subroutines would be nice.
    } else {
        Admin.PendingQueue({
            "teamName": teamLower,
            "userName": user
        }).save().then((savedQueue) => {
            console.log('added to pendingteam member queue');
        }, (err) => {
            console.log('we had an error creating this queue');
        })
    }
}

module.exports = {
    removePendingQueue: cleanUpPendingQueue,
    removePendingByTeamAndUser: cleanUpPendingQueueTeamnameUsername,
    addToPendingTeamMemberQueue: addToPendingTeamMemberQueue
}