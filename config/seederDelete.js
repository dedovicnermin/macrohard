
const db = require('./db'),
User = require('../models/User'),
Project = require('../models/Project'),
//ProjectFile = require('../models/ProjectFile'),
Group = require('../models/Group'),
Task = require('../models/Task'),
//Submission = require('../models/Submission'),
//Chatroom = require('../models/Chatroom'),
Update = require('../models/Update'),

UserProject = require('../models/UserProject'),
//UserGroup = require('../models/UserGroup'),
UserTask = require('../models/UserTask'),
//UserChatroom = require('../models/UserChatroom'),
//Message = require('../models/Message'),
Badge = require('../models/Badge'),
Review = require('../models/Review'),
UserBadge = require('../models/UserBadge');

module.exports = {
    userDelete: () => {
        User.destroy(
            {where: {}}
        ).then(() => {
            console.log("success");
        }).catch(err => {
            console.log(`fail: ${err}`);
        });
    },
    projectDelete: () => {
        Project.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    userProjectDelect: () => {
        UserProject.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    groupDelete: () => {
        Group.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    taskDelete: () => {
        Task.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    userTaskDelete: () => {
        UserTask.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    reviewDelete: () => {
        Review.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    badgeDelete: () => {
        Badge.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    userBadgeDelete: () => {
        UserBadge.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    },
    updateDelete: () => {
        Update.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));
    }

};

