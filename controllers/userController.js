const Review = require('../models/Review');

const express = require('express'),
userRouter = express.Router(),
Project = require("../models/Project"),
Group = require("../models/Group"),
Task = require("../models/Task"),
User = require("../models/User"),
UserProject = require('../models/UserProject'),
Badge = require('../models/Badge'),
UserBadge = require('../models/UserBadge'),
UserGroup = require('../models/UserGroup'),
UserTask = require('../models/UserTask');



//////////////////////////USER PROFILE PAGE//////////////////////////////


userRouter.get('/:userId/profile', async (req, res) => {
    const obj = await gatherProfile(req.params.userId);
    res.render('userProfile', {obj});
});

//.post() -> when wanting to edit their profile
userRouter.post("/:userId/profile", async (req, res) => {
    User.update(
        {
            user_title: req.body.userTitle,
            user_phone: req.body.userPhone,
            user_location: req.body.userLocation,
            user_img: req.body.profileImg
        },
        {
            where: {user_id: req.params.userId},
        }
    ).then( () => {
        res.redirect(`/user/${req.params.userId}/profile`);
    }).catch(err => {
        console.log(err);
        res.render('error');
    });
});

const gatherProfile = async (userID) => {
    //grabbing user_name, user_email, tasks_completed*, avg_contribution*, user_title*, user_phone*, user_location*, user_img
    
    try {
        
        const user = await User.findOne({
            where: {user_id: userID},
            attributes: {
                exclude: ['user_password', 'user_type']
            }
        });
        
        const userBadges = await UserBadge.findAll({
            where: {
                user_id: userID
            },
            order: [
                ['badge_id', 'ASC']
            ]
        });

        let bInfo = [];
        const badgeInfo = async () => {
            await asyncForEach(userBadges, async (element) => {
                const b = await Badge.findOne({
                    where: {badge_id: element.badge_id},
                });
                bInfo.push({
                    name: b.badge_name,
                    description: b.badge_description,
                    img: b.badge_img,
                    count: element.count
                });
            });
        };
        await badgeInfo();

        const projects = await UserProject.findAll({
            where: {user_id: userID}
        });
        const groups = await UserGroup.findAll({
            where: {user_id: userID}
        });
        const tasks = await UserTask.findAll({
            where: {user_id: userID}
        });

        

        return {
            user: user,
            badges: bInfo,
            projects: projects.length,
            groups: groups.length,
            tasks: tasks.length
        };
    
        
        
        
        
    }
    catch (err) {
        return {err: err};
    }

};


/////////////////////////////////////////////////////////////////////




//////////////////////////PROJECTS PAGE//////////////////////////////

userRouter.get('/:userId/projects', async (req, res) => {
    const obj = await gatherUserProjects(req.params.userId);
    res.render('projectsPage', {obj});
});

//gather information for every project linked to this specific user
// returns : projectID, projectName, projectDueDate, projectMemberCount
const gatherUserProjects = async (userID) => {
    try {
        let ret = [];
        const userProjects = await UserProject.findAll({
            where: {user_id: userID}
        });

        const projects = async () => {
            await asyncForEach(userProjects, async (element) => {
                const p = await Project.findOne({
                    where: {
                        proj_id: element.proj_id
                    }
                });
                const motivationMessages = ["Time to Eat!", "Get to it!", "You Got This!", "No Time Better Than Now!", "Aim for the Stars!", "No Limits on Success!"];
                ret.push({
                    id: p.proj_id,
                    name: p.proj_name,
                    dueDate: p.proj_duedate,
                    memberCount: p.proj_membercount,
                    motivation: motivationMessages[p.proj_id % motivationMessages.length+1]
                });
            });

        };

        await projects();
        return ret;

    } catch (err) {
        console.log(err);
        res.render('error');
    }
};

////////////////////////////////////////////////////////////////////



//////////////////////////GROUPS PAGE//////////////////////////////


// get groups for this project
userRouter.get('/:userId/:projectId/groups', async (req, res) => {
    try {
        const data = await Project.findOne({
            where: {proj_id: req.params.projectId},
            include: {
                model: Group,
                where: {proj_id: req.params.projectId},
                attributes: {
                    exclude: ['proj_id']
                }
            }
        });
        const {groups, proj_id, proj_name} = data;
        const obj = {proj_id: proj_id, proj_name, user_id: req.params.userId, groups: groups}

        res.render('groupsPage', {obj});
    } catch (err) {
        res.render('error', {err});
    }
});

// add a group
userRouter.post('/:userId/:projectId/groups', async (req, res) => {
    try {
        const g = await Group.create(
            {
                group_name: req.body.groupName,
                group_img: req.body.groupImg,
                proj_id: req.params.projectId
            }
        );

        res.redirect(`/user/${req.params.userId}/${req.params.projectId}/groups`);   
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});




////////////////////////////////////////////////////////////////////////////////////



//////////////////////////TASKS PAGE//////////////////////////////

const completeGather = async (taskId) => {
    const us = await findUsers(taskId);
    const data = await findUserInfo(us);
    return data;    
} 

const findUserInfo = async (userIds) => {
    let arr = [];
    const eachLoop = async () => {
        await asyncForEach(userIds, async (id) => {
            const user = await User.findOne({
                where: {user_id: id.user_id},
                attributes: ['user_id', 'user_name', 'user_img'],
                raw: true
            });
            arr.push(user);
        });
        return arr;
    }
    
    let users = await eachLoop();
    return users;
    
}

const findUsers = async (id) => {
    const findUsersList = await UserTask.findAll({
        where: {task_id: id},
        attributes: ['user_id'],
        raw : true
    });

    return findUsersList;
}

userRouter.get('/:userId/:projectId/:groupId/tasks', async (req, res) => {
    try {
        const completed = [], notCompleted = [];
        
        const tasks = await Task.findAll({
            where: {group_id: req.params.groupId},
        });
        
            
        const setup = async () => { 
            await asyncForEach(tasks, async (task) => {
                if (task.task_status == 'Complete') {
                    const data = await completeGather(task.task_id);
                    completed.push({
                        taskId: task.task_id,
                        taskName: task.task_name,
                        dueDate: task.task_dueDate,
                        status: task.task_status,
                        members: data
                    });
                } else {
                    const data = await completeGather(task.task_id);
                    notCompleted.push({
                        taskId: task.task_id,
                        taskName: task.task_name,
                        dueDate: task.task_dueDate,
                        status: task.task_status,
                        members: data
                    });
                }
            });  
        }
        await setup();
        res.json({completed: completed, notCompleted: notCompleted});

        
    } catch (err) {
        console.log(err);
        res.json({err: err});
    }
    
});


userRouter.post('/:userId/:projectId/:groupId/tasks', async (req, res) => {

});













//////////////////////////STATS PAGE//////////////////////////////


userRouter.get('/:userId/:projectId/stats', async (req, res) => {
    const obj = await gatherTableInfo(req.params.projectId, req.params.userId);
    res.render('statsPage', {obj});
});

userRouter.get('/:userId/:projectId/stats/getstats', async (req, res) => {
    try {
        console.log("Server side: gathering info about groups/tasks belonging to project...");
        const obj = await gatherTaskInfo(req.params.projectId);
        res.json(obj);
    } catch (err) {
        console.log("server-side: Fail");
        console.log("error: " + err);
        res.json({ error: err });
    }
});




const gatherTableInfo = async (projID, userID) => {
    try {
        var isFaculty;
        const userType = await User.findOne({
            attributes: ['user_type'],
            where: {user_id: userID}
        });
        
        
        if (userType.user_type === 'USER') {
            isFaculty = false;
        } else {
            isFaculty = true;
        }

        var dict = {};
        var avgs = {};
        var a = [];
        if (!isFaculty) {
            const reviews = await Review.findAll({
                where: {proj_id: projID, user_id: userID}
            }).then(allReviews => {
                allReviews.forEach(review => {
                    if (dict[review.task_id]) {
                        dict[review.task_id] = [dict[review.task_id][0] + review.review_score, dict[review.task_id][1] + 1];
                    } else {
                        dict[review.task_id] = [review.review_score, 1];
                    }
                });
                
                for (var key in dict) {
                    avgs[key] = dict[key][0] / dict[key][1];
                }
                console.log(avgs);

                for (var k in avgs) {
                    a.push({"TASK": k, "AVG": avgs[k]});
                }
                
            })
            .catch(err => console.log(err));

        } else {
            const reviews = await Review.findAll({
                where: {proj_id: projID}
            }).then(allReviews => {
                allReviews.forEach(review => {
                    if (dict[[review.task_id, review.user_id]]) {
                        dict[[review.task_id, review.user_id]] = [dict[[review.task_id, review.user_id]][0] + review.review_score, dict[[review.task_id, review.user_id]][1] + 1];
                    } else {
                        dict[[review.task_id, review.user_id]] = [review.review_score, 1];
                    }
                });

                for (var key in dict) {
                    avgs[key] = dict[key][0] / dict[key][1];
                }
                
                for (var k in avgs) {
                    var s = k.split(",");
                    a.push({
                        "TASK": s[0],
                        "USER": s[1],
                        "AVG": avgs[k]
                    });
                }
                console.log("a:");
                console.log(a);
                
               
            })
            .catch(err => console.log(err));
        }

        return {rows:a, isFaculty: isFaculty};

        


        
    }
    catch (err) {
        console.log(err);
    }
};



const gatherTaskInfo = async (projID) => {
    try {
        const proj = await Project.findOne({
            attributes: ['proj_id'],
            where: {proj_id: projID},
            include: [{
                model: Group,
                attributes: ['group_id'],
                where: {proj_id: projID}
            }]
        });

        let tasks = [];

        const task = async () => {
            await asyncForEach(proj.groups, async (element) => {
                const t = await Task.findAll({
                    attributes: ['task_status', 'task_overdue', 'group_id'],
                    where: {
                        group_id: element.group_id
                    }
                });
                console.log("found: " + element + "\n");
                tasks.push(t);
            });
            
        }

        await task();
        tasks = condenseTasks(tasks);
        var completedOrNot = compNotComp(tasks);
        var completed = compOnTime(tasks);
        var notCompleted = notCompOnTime(tasks);
        return {

            p1: completedOrNot,
            p2: completed,
            p3: notCompleted
            
        };

    } catch (err) {
        console.log(err);
    }
}
function compNotComp(tasks) {
    var comp = 0, notComp = 0;
    tasks.forEach(task => {
        if (task.task_status == 'Complete') {
            comp++;
        } else {
            notComp++;
        }
    });
    return [comp, notComp];
} 

function compOnTime(tasks) {
    var comp = 0, notComp = 0;
    tasks.forEach(task => {
        if (task.task_status == 'Complete' && !task.task_overdue) {
            comp++;
        } else if (task.task_status == 'Complete' && task.task_overdue){
            notComp++;
        }
    });
    return [comp, notComp];
}

function notCompOnTime(tasks) {
    var comp = 0, notComp = 0;
    tasks.forEach(task => {
        if (task.task_status == 'Not Complete' && !task.task_overdue) {
            comp++;
        } else if (task.task_status == 'Not Complete' && task.task_overdue){
            notComp++;
        }
    });
    return [comp, notComp];
}



function condenseTasks(tasks) {
    var ret = [];
    tasks.forEach(task => {
        ret.push(...task);
    });
    return ret;
}



async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index]);
    }
}













module.exports = userRouter;