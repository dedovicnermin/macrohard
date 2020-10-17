
const db = require('./db'),
User = require('../models/User'),
Project = require('../models/Project'),
//ProjectFile = require('../models/ProjectFile'),
Group = require('../models/Group'),
Task = require('../models/Task'),
//Submission = require('../models/Submission'),
//Chatroom = require('../models/Chatroom'),
//Update = require('../models/Update'),
//UserProject = require('../models/UserProject'),
//UserGroup = require('../models/UserGroup'),
//UserTask = require('../models/UserTask'),
//UserChatroom = require('../models/UserChatroom'),
//Message = require('../models/Message'),
//Badge = require('../models/Badge'),
Review = require('../models/Review');
//UserBadge = require('../models/UserBadge');

const queryInterface = db.getQueryInterface();


module.userDelete = User.destroy(
    {where: {}}
).then(() => {
    console.log("success");
}).catch(err => {
    console.log(`fail: ${err}`);
});


module.projectDelete = Project.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));


module.groupDelete = Group.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));

module.taskDelete = Task.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));

module.ReviewDelete = Review.destroy({where: {}}).then(() => console.log('success')).catch(err => console.log(`fail: ${err}`));