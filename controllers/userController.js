const Review = require('../models/Review');

const express = require('express'),
userRouter = express.Router(),
Project = require("../models/Project"),
Group = require("../models/Group"),
Task = require("../models/Task"),
User = require("../models/User");







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