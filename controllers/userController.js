const express = require('express'),
userRouter = express.Router(),
Project = require("../models/Project"),
Group = require("../models/Group"),
Task = require("../models/Task"),
User = require("../models/User");







userRouter.get('/:userId/:projectId/stats', (req, res) => {
    res.render('statsPage');
});



// AJAX REQUESTS

// Route path: /flights/:from/:to
// Request URL: http://localhost:3000/user/:userId/:projectId/stats/getstats
// req.params: {"userId" : "", "projectId" : ""}




    
    
    
//});
// projectStats: {pie1: [], pie2: [], pie3: []},
// groupStats: {pie1: [], pie2: [], pie3: []},
// individual: [{username: "", taskName: "", score: 0}]


//res.json({label: "label"});





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
                    where: {
                        group_id: element.group_id
                    }
                });
                console.log("found: " + element + "\n");
                tasks.push(t);
            });
            
        }

        await task();

        return {
            project: proj,
            groups: proj.groups,
            tasks: tasks
        }

    } catch (err) {
        console.log(err);
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index]);
    }
}













module.exports = userRouter;