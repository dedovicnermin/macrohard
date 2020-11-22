
const Review = require('../models/Review');

const express = require('express'),
    userRouter = express.Router(),
    Project = require("../models/Project"),
    Group = require("../models/Group"),
    Task = require("../models/Task"),
    Update = require("../models/Update"),
    User = require("../models/User"),
    UserProject = require('../models/UserProject'),
    ProjectFile = require('../models/ProjectFile'),
    Badge = require('../models/Badge'),
    UserBadge = require('../models/UserBadge'),
    UserGroup = require('../models/UserGroup'),
    UserTask = require('../models/UserTask'),
    Submission = require('../models/Submission'),
    sequelize = require('sequelize');







//////////////////////////USER PROFILE PAGE//////////////////////////////


userRouter.get('/:userId/profile', async (req, res) => {
    const obj = await gatherProfile(req.params.userId);
    res.render('userProfile', {obj, userId: req.params.userId});
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
    const isFaculty = await facultyTest(req.params.userId);
    res.render('projectsPage', {obj, userId: req.params.userId, isFaculty: isFaculty});
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

userRouter.post('/:userId/projects/addproject', async (req, res) => {
    try {
        const newProj = await Project.create({
            proj_name: req.body.projName,
            proj_duedate: new Date(req.body.dueDate),
            proj_description: req.body.projDescription
        });
        await UserProject.create({
            user_id: req.params.userId,
            proj_id: newProj.proj_id  
        });
    
        res.redirect(`/user/${req.params.userId}/projects`);
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});

////////////////////////////////////////////////////////////////////







//////////////////////////PROJECT DETAILS PAGE//////////////////////

const addProjFilesToStorage = async (filelist, req) => {
    const uploadFolder = req.app.locals.__basedir + '/uploads/';
    if (filelist) {
        filelist.forEach(ele => {
            const outputFilepath = uploadFolder + '/' + ele.file_name;
            fs.createWriteStream(outputFilepath).write(ele.file);
        });
    }
}

const projDetailsGather = async (projId, userId, req) => {
    try {
        await removeFilesFromStorage(req);
        const pFiles = await ProjectFile.findAll({
            where: {proj_id: projId},
            attributes: ['file_name', 'file'],
            raw: true
        });
        const isFaculty = await facultyTest(userId);
        await addProjFilesToStorage(pFiles, req);
        const proj = await Project.findOne({
            where: {proj_id: projId},
            plain: true,
            raw: true
        });

        
        

        const projInfo = {
            projId : proj.proj_id,
            projName: proj.proj_name,
            dueDate: proj.proj_duedate,
            members: proj.proj_membercount,
            description: proj.proj_description
        }
        
        return {
            proj: projInfo,
            isFaculty: isFaculty,
            pFiles: pFiles
        }
    } catch (error) {
        console.log(error);
        return {};
    }
}


userRouter.get('/:userId/:projectId/details', async (req, res) => {
    //only faculty can see edit button, pass data about if user/not user
    //info needed isUser, # members in project, proj duedate, files associated with project

    try {
        const {proj, isFaculty, pFiles} = await projDetailsGather(req.params.projectId, req.params.userId, req);
        // res.json({proj: proj, isFaculty: isFaculty, pFiles: pFiles});
        res.render('projectDetailsPage', {proj: proj, isFaculty: isFaculty, pFiles: pFiles, userId: req.params.userId, projId: req.params.projectId });
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});

userRouter.post('/:projectId/editproj', (req, res) => {
    Project.update(
        {
            proj_name: req.body.projTitle,
            proj_description: req.body.projDesc
        },
        {
            where: {proj_id: req.params.projectId},
            returning: true,
            raw: true,
            plain: true
        }
    ).then(result => {
        const str = result[1].proj_name + "~" + result[1].proj_description;
        res.send(str);
    }).catch(err => {
        console.log(err);
        res.render('error');
    });

});






////////////////////////////////////////////////////////////////////













//////////////////////////USER SETTINGS PAGE//////////////////////

userRouter.get('/:userId/settings', (req, res) => {
    res.render('settingsPage', {userId: req.params.userId});
});

userRouter.post('/:userId/settings', async (req, res) => {
    try {
        await User.destroy({
            where: {user_id: req.params.userId}
        });
        res.render('loginPage');
    } catch (error) {
        res.render('error');
    }
})








////////////////////////////////////////////////////////////////////
















//////////////////////////PROJECT MEMBERS PAGE//////////////////////

const facultyTest = async (id) => {
    try {
        const userType = await User.findOne({
            attributes: ['user_type'],
            where: {user_id: id}
        });
        if (userType.user_type === 'USER') {
            return false;
        }
        return true;
    } catch (err) {
        console.log("something went wrong within isFaculty() helper: \n\n\n" + err);
    }
}

const findProjectMembers = async (id) => {
    try {
        const members = await UserProject.findAll({
            where: {proj_id: id},
            attributes: ['user_id'],
            raw: true
        });
        
        return members; //returns list of objects

    } catch(err) {
        console.log("something went wrong within findProjectMembers() helper: \n\n\n" + err);
    }
}



//reliant on findUserInfo(userIds) -> tasks page helper
const formatProjectMembers = (memberList) => {
    let formatted = [];
    memberList.forEach(member => {
        formatted.push({
            memberId: member.user_id,
            memberName: member.user_name,
            memberImg: member.user_img,
            memberEmail: member.user_email,
            memberType: member.user_type
        });
    });
    formatted.sort((a,b) => (a.memberName > b.memberName) ? 1 : ((b.memberName > a.memberName) ? -1 : 0));
    return formatted; //returns list of objects in order by userName
}

const getProjectName = async (id) => {
    try {
        const name = await Project.findOne({
            where: {proj_id: id},
            attributes: ['proj_name'],
            raw: true
        });
        return name.proj_name;
    } catch (err) {
        console.log(err);
        return "";
    }
}

const gatherMembersPageData = async (projId, userId) => {

    try {
        const projectMembers = await findProjectMembers(projId);
        const userInfo = await findUserInfo(projectMembers);
        const isFaculty = await facultyTest(userId);
        const projName = await getProjectName(projId);
        const formatted = formatProjectMembers(userInfo);
        
        return {
            projectName: projName,
            members: formatted,
            isFaculty: isFaculty,
            memberCount: formatted.length
        };
    } catch (err) {
        console.log("something went wrong within gatherMembersPage() helper: \n\n\n" + err);
    }
}


//post request helpers:::
const userEmailCheck = async (email) => {
    const user = await User.findOne({
        where: {user_email: email},
        raw: true
    });
    return user;
    //will return an object or null if cant find
}


//ADD MEMBER TO PROJ
const addMemberToProject = async (email, projId) => {
    const user = await User.findOne({
        where: {user_email: email},
        attributes: ['user_id'],
        raw: true
    });
    
    await UserProject.create(
        {
            user_id: user.user_id,
            proj_id: projId
        }
    );
    const count = await Project.findOne({
        where: {proj_id: projId},
        attributes: ['proj_membercount'],
        raw: true
    });

    await Project.update({
        proj_membercount: count.proj_membercount + 1
    }, {where: {proj_id: projId}});
    
}


//REMOVE MEMBER FROM PROJ
const removeMemberFromProject = async (email, projId) => {
    const user = await User.findOne({
        where: {user_email: email},
        attributes: ['user_id'],
        raw: true
    });
    await UserProject.destroy({
        where: {user_id: user.user_id, proj_id: projId}
    });

    const count = await Project.findOne({
        where: {proj_id: projId},
        attributes: ['proj_membercount'],
        raw: true
    });

    await Project.update({
        proj_membercount: (count.proj_membercount - 1)
    }, {where: {proj_id: projId}});
}




userRouter.get('/:userId/:projectId/members', async (req, res) => {
    //get + display members to this project. show email bc of uniqueness and bridge to messaging. count of members. Title: projectName Members. display button if client is faculty so that they'd be able to add members. 
    try {
        const obj = await gatherMembersPageData(req.params.projectId, req.params.userId);
        // res.json(obj);
        res.render('projectMembersPage', {obj, userId: req.params.userId, projId: req.params.projectId });
    } catch (err) {
        res.json({error: err});
    }
    
});


userRouter.post('/:userId/:projectId/addmember', async (req, res) => {
    //faculty or admin* adding member
    // with user email - find userId and add it to user_projects. 
    // update projects.memberCount +1
    try {
        await addMemberToProject(req.body.userEmail, req.params.projectId);
        res.redirect(`/user/${req.params.userId}/${req.params.projectId}/members`);
    } catch (err) {
        res.render('error', {error: err});
    }

});

userRouter.post('/:userId/:projectId/removemember', async (req, res) => {
    //faculty or admin* adding member
    // with user email - find userId and remove from user_projects. 
    // update projects.memberCount -1
    try {
        await removeMemberFromProject(req.body.userEmail, req.params.projectId);
        res.redirect(`/user/${req.params.userId}/${req.params.projectId}/members`);
    } catch (err) {
        res.render('error', {error: err});
    }

});

//AJAX request to confirm DB has an email that faculty entered:
userRouter.get('/:userEmail/userexist', async (req, res) => {
    try {
        const check = await userEmailCheck(req.params.userEmail);
        if (check) {
            res.json({res: "true"});
        }
        res.json({res: "false"});
    } catch (err) {
        console.log("error within get request to -> /:userEmail/userexist");
        res.json({error: err});
    }
});





////////////////////////////////////////////////////////////////////











//////////////////////////GROUPS PAGE//////////////////////////////


// get groups for this project
userRouter.get('/:userId/:projectId/groups', async (req, res) => {
    try {
        let data = await Project.findOne({
            where: {proj_id: req.params.projectId},
            include: {
                model: Group,
                where: {proj_id: req.params.projectId},
                attributes: {
                    exclude: ['proj_id']
                },
                order: [
                    ['group_name', 'ASC']
                ]
            }
        });
        
        //on fresh creation of project
        if (data == null) {
            const p = await Project.findOne({where: {proj_id: req.params.projectId}, raw: true, attributes: ['proj_name']});
            data = {};
            data.groups = [];
            data.proj_id = req.params.projectId;
            data.proj_name = p.proj_name;
        }

        const {groups, proj_id, proj_name} = data;
        const obj = {proj_id: proj_id, proj_name, user_id: req.params.userId, groups: groups}

        res.render('groupsPage', {obj, userId: req.params.userId, projId: req.params.projectId});
    } catch (err) {
        console.log(err);
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



//////////////////////////GROUP TASKS PAGE//////////////////////////////

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
                attributes: ['user_id', 'user_name', 'user_img', 'user_email', 'user_type'],
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

const testOverDue = async (id) => {
    try {
        const taskDD = await Task.findOne({
            where: {task_id: id},
            attributes: ['task_dueDate'],
            raw: true
        });
        const taskDate = new Date(taskDD.task_dueDate);

        if (new Date() > taskDate) {
            const waiting = await Task.update({
               task_overdue: true
            }, {where: {task_id: id}});
            return "TRUE";
        } else {
            return "FALSE";
        }
        
    } catch (err) {
        console.log(err);
        
    } 
}

const getGroupName = async (id) => {
    try {
        const name = await Group.findOne({
            where: {group_id: id},
            attributes: ['group_name'],
            raw: true
        });
        return name.group_name
    } catch (err) {
        return "Group";
    }
}

const inGroupTest = async (userId, groupId) => {
    try {
        const test = await UserGroup.findOne({
            where: {user_id: userId, group_id: groupId}
        });
        if (test) {
            console.log(test);
            console.log("user: " + userId + " is in group: " + groupId);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

userRouter.get('/:userId/:projectId/:groupId/tasks', async (req, res) => {
    try {
        const completed = [], notCompleted = [];
        
        const tasks = await Task.findAll({
            where: {group_id: req.params.groupId},
            attributes: ['task_id', 'task_name', 'task_description', 'task_status', 'task_score', 'task_dueDate', 'task_overdue', 'task_approval', 'group_id'],
            order: [
                ['task_id', 'ASC']
            ]
        });
            
        const setup = async () => { 
            await asyncForEach(tasks, async (task) => {
                let str = task.task_name;
                str = str.replace(/\s/g, '');
                if (task.task_status == 'Complete') {
                    const data = await completeGather(task.task_id);                    
                    completed.push({
                        taskId: task.task_id,
                        taskName: task.task_name,
                        dueDate: task.task_dueDate,
                        members: data,
                        nameNoSpace: str
                    });
                } else {
                    const test = await testOverDue(task.task_id);
                    const data = await completeGather(task.task_id);
                    notCompleted.push({
                        taskId: task.task_id,
                        taskName: task.task_name,
                        dueDate: task.task_dueDate,
                        overdue: test,
                        members: data,
                        nameNoSpace: str
                    });
                }
            });  
        }
        await setup();
        
        const inGroup = await inGroupTest(req.params.userId, req.params.groupId);
        const isFaculty = await facultyTest(req.params.userId);
        const groupName = await getGroupName(req.params.groupId);
        res.render('groupTasksPage', {completed: completed, notCompleted: notCompleted, userId: req.params.userId, projId: req.params.projectId, groupId: req.params.groupId, groupName: groupName, inGroup: inGroup, isFaculty: isFaculty });
        // res.json({completed: completed, notCompleted: notCompleted, userId: req.params.userId, projId: req.params.projectId, groupId: req.params.groupId, groupName: groupName });
        
    } catch (err) {
        console.log(err);
        res.render('error', {err});
    }
    
});


userRouter.post('/:userId/:projectId/:groupId/tasks', async (req, res) => {
    try {
        
        const task = await Task.create(
            {
                task_name: req.body.taskName,
                task_description: req.body.taskDescription,
                group_id: req.params.groupId,
                task_dueDate: new Date(req.body.dueDate),
                task_description: req.body.taskDescription
            }
        );
        res.redirect(`/user/${req.params.userId}/${req.params.projectId}/${req.params.groupId}/tasks`);

    } catch (err) {
        console.log(err);
        res.render('error', {err});
    }
});


userRouter.post('/:userId/:projId/:groupId/addself', async (req, res) => {
    try {
        UserGroup.create({
            user_id: req.params.userId,
            group_id: req.params.groupId
        });
        
        await Group.update(
            {
                total_members: sequelize.literal('total_members + 1')
            }, {
                where: {group_id: req.params.groupId}
            }
        );

        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/tasks`);
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});

userRouter.post('/:userId/:projId/:groupId/removeself', async (req, res) => {
    try {
        UserGroup.destroy({
            where: {user_id: req.params.userId, group_id: req.params.groupId}
        });
        await Group.update(
            {
                total_members: sequelize.literal('total_members - 1')
            }, {
                where: {group_id: req.params.groupId}
            }
        );
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/tasks`);
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});

userRouter.post('/:userId/:projId/:groupId/removegroup', async (req, res) => {
    try {
        await Group.destroy({
            where: {group_id: req.params.groupId}
        });
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/groups`);

    } catch (error) {
        console.log(error);
        res.render('error');
    }
});


//NEEDS POST REQUEST TO ADD A USER TO GROUP / UPDATE USER_GROUP TABLE



////////////////////////////////////////////////////////////////////////////////////


















//////////////////////////SPECIFIC TASK PAGE//////////////////////////////
//Get
//infoNeeded: task - name, approved, due, grade, description, members, taskStatus, if current user is in task or not
// updates
// submissions

const fs = require('fs');




const removeFilesFromStorage = async (req) => {
    const uploadFolder = req.app.locals.__basedir + '/uploads/';
    await fs.readdir(uploadFolder, (err, files) => {
        if (err) {
            return;
        }
        if (files.length != 0) {
            files.forEach(file => {
                fs.unlinkSync(uploadFolder+file, err => {
                    console.log("error with unlinking file from upload folder");
                });
            });
        }
    });    
}


const addFilesToStorage = async (subList, req) => {
    const uploadFolder = req.app.locals.__basedir + '/uploads/';
    if (subList) {
        subList.forEach(sub => {
            const outputFilepath = uploadFolder + '/' + sub.sub_name;
            fs.createWriteStream(outputFilepath).write(sub.sub_doc);
        });
    }
}

const getTaskSubmissions = async (id) => {
    try {
        const submissions = await Submission.findAll({
            where: {task_id: id},
            attributes: ['sub_name', 'sub_doc']
        });
        let subdata = [];
        submissions.forEach(sub => {
            const data = sub.sub_doc;
            subdata.push(data);
        });
        return submissions;
    } catch (error) {
        console.log("error found within getTaskSubmissions()\n\n" + error);
        return {err: error};
    }
}


const getTaskInfo = async (id, userId) => {
    try {
        const task = await Task.findOne({
            where: {task_id: id},
            raw: true,
            attributes: ['task_id', 'task_name', 'task_description', 'task_status', 'task_score', 'task_approval', 'group_id', 'task_dueDate']
        });
        let score;
        if (task.task_score == null || task.task_score == undefined) {
            score = "- / 5"
        } else {
            score = task.task_score + " / 5";
        }


        let isUserInTask = false;
        const users = await UserTask.findAll({
            where: {task_id: id}, 
            raw: true
        });

        users.forEach(user => {
            if (user.user_id == userId) {
                isUserInTask = true;
            }
        });

        let memberInfo = [];
        const mI = async () => {
            await asyncForEach(users, async (ele) => {
                const u = await User.findOne({
                    attributes: ['user_id', 'user_name'],
                    where: {
                        user_id: ele.user_id,
                        user_type: 'USER'
                    },
                    raw: true
                });
                memberInfo.push({memberId: u.user_id, memberName: u.user_name});
            });
        }
        await mI();
        
        return {
            taskId: task.task_id,
            groupId: task.group_id,
            taskName: task.task_name,
            taskDescription: task.task_description,
            taskStatus: task.task_status,
            taskScore: score,
            taskApproval: task.task_approval.toString().toUpperCase(),
            taskDue: task.task_dueDate,
            taskOverdue: task.task_overdue,
            userInTask: isUserInTask,
            memberInfo: memberInfo
        };

    } catch (err) {
        console.log("error found within getTaskInfo()\n\n" + err);
        return {err: err};
    }
}

const getTaskUpdates = async (id) => {
    try {
        const updates = await Update.findAll({
            where: {task_id: id},
            raw: true,
            include: [{
                model: User,
                attributes: ['user_name'],
                required: true
            }]
        });
        return updates;

    } catch (error) {
        console.log("error found within getTaskUpdate()\n\n" + error);
        return {err: error};
    }
}








const taskPageGather = async (id, userId, req) => {
    try {
        const submissions = await getTaskSubmissions(id);
        await removeFilesFromStorage(req);
        const taskInfo = await getTaskInfo(id, userId);
        const updates = await getTaskUpdates(id);
        await addFilesToStorage(submissions, req);
        let updateFormatted = [];
        updates.forEach(update => {
            let grab = update.update_time.toString(); 
            let date = grab.split('T');
            let userName = Object.values(update).pop();
            updateFormatted.push({
                updateId: update.update_id,
                title: update.update_title,
                content: update.update_message,
                postedBy: userName + " - " + date[0].replace("GM", "")
            });
        });
        let submissionFormatted = [];
        submissions.forEach(sub => {
            submissionFormatted.push(sub.sub_name);
        });
        return {
            task: taskInfo,
            updates: updateFormatted,
            submissions: submissionFormatted,
            // subs: submissions
        }
    } catch (error) {
        console.log("error found within taskPageGather()\n\n" + error);
        return {err: error};
    }
    
}



//post
//- post update
//-post submission*
//-edit task description*
//-adding/removing user from group*
//-comp/not comp change
//- review peers form*

userRouter.get('/:userId/:projId/:groupId/:taskId/:taskName', async (req, res) => {
    const obj = await taskPageGather(req.params.taskId, req.params.userId, req);
    const {task, updates, submissions} = obj;
    const isFaculty = await facultyTest(req.params.userId);
    // res.json({task, updates, submissions, userId: req.params.userId, projId: req.params.projId, groupId: req.params.groupId, taskId: req.params.taskId, isFaculty: isFaculty});
    res.render('taskPage', {task, updates, submissions, userId: req.params.userId, projId: req.params.projId, groupId: req.params.groupId, taskId: req.params.taskId, isFaculty: isFaculty});
});


// submitting review
userRouter.post('/:userId/:projId/:groupId/:taskId/submitreview', async (req, res) => {
    
    try {

        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const numReviews = parseInt(req.body.numReviews) - 1;
        
        
        const forLoop = async _ => {
            for (let i = 0; i < numReviews; i++) {
                let userId = keys[i];
                let userScore = parseInt(values[i][0]);
                let badgeID = (values[i][1] == 'none') ? null : parseInt(values[i][1]);

                
                
                await Review.create({
                    user_id: userId,
                    review_score: userScore,
                    task_id: req.params.taskId,
                    badge_id: badgeID,
                    proj_id: req.params.projId
                });
    
        
                //update user_badge count
                if (badgeID != null) {
                    const bCount = await UserBadge.findOne({
                        where: {user_id: userId, badge_id: badgeID},
                        attributes: ['count']
                    });
                    await UserBadge.update(
                        {
                            count: bCount.count + 1
                        },
                        {
                            where: {user_id: userId, badge_id: badgeID}
                        }
                    );
                }


                //updating first or tenth badge
                const checkFirstTask = await UserBadge.findOne({
                    where: {badge_id: 4, user_id: userId},
                    attributes: ['count']
                });

                if (checkFirstTask && checkFirstTask.count == 0) {
                    await UserBadge.update(
                        {
                            count: 1
                        },
                        {
                            where: {user_id: userId, badge_id: 4}
                        }
                    );
                }
                const checkTenthTask = await UserBadge.findOne({
                    where: {badge_id: 7, user_id: userId},
                    attributes: ['count']
                });

                if (checkTenthTask && checkTenthTask.count == 9) {
                    await UserBadge.update(
                        {
                            count: 1
                        },
                        {
                            where: {user_id: userId, badge_id: 7}
                        }
                    );
                }
                
          
    
                //update user avg contribution
                const numReviews = await Review.findAll({
                    where: {user_id: userId},
                    attributes: [
                        [sequelize.fn('sum', sequelize.col('review_score')), 'review_sum'],
                        [sequelize.fn('count', sequelize.col('review_score')), 'review_count']
                    ],
                    raw: true
                });

                
                
                let obj = numReviews[0];
                let newCont = parseFloat(obj.review_sum / obj.review_count).toFixed(2);
                await User.update(
                    {
                        avg_contribution: newCont
                    },
                    {
                        where: {user_id: userId}
                    }
                );    
            }
        }
        await forLoop();
        
        
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/tasks`);
        
    } catch (err) {
        console.log(err);
        console.log("\n\n\n");
        res.render('error', {err});
    }
});


//faculty approving task
userRouter.post('/:userId/:projId/:groupId/:taskId/approvetask', async (req, res) => {
    try {
        await Task.update(
            {
                task_approval: true,
                task_score: parseInt(req.body.score)
            },
            {
                where: {task_id: req.params.taskId}
            }
        );
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/tasks`);

    } catch (err) {
        console.log(err);
        res.render('error');
    }
})


//remove self from task
userRouter.post('/:userId/:projId/:groupId/:taskId/removeself', async (req, res) => {
    try {
        await UserTask.destroy({
            where: {user_id: req.params.userId, task_id: req.params.taskId}
        });
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/tasks`);

    } catch (err) {
        console.log(err);
        res.render('error');
    }
});

//adding self to task
userRouter.post('/:userId/:projId/:groupId/:taskId/addself', async (req, res) => {
    try {
        await UserTask.create({
            user_id: req.params.userId,
            task_id: req.params.taskId
        });
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/tasks`);
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});


//change task_status
userRouter.post('/:userId/:projId/:groupId/:taskId/changestatus', async (req, res) => {
    try {
        await Task.update(
            {
                task_status: req.body.tStatus
            },
            {
                where: {task_id: req.params.taskId}
            }
        );
        
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/tasks`);
    
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});




//editing task name / description
userRouter.post('/:userId/:projId/:groupId/:taskId/editdescription', async (req, res) => {
    try {
        await Task.update(
            {
                task_name: req.body.taskName,
                task_description: req.body.taskDescription
            },
            {
                where: {task_id: req.params.taskId},
                returning: true,
                plain: true
            }
        );
        let str = req.body.taskName;
        str = str.replace(/\s/g, '');
        res.redirect(`/user/${req.params.userId}/${req.params.projId}/${req.params.groupId}/${req.params.taskId}/${str}`);
        
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});


userRouter.post('/:userId/:projId/:groupId/:taskId/addupdate', async (req, res) => {
    try {
        const name = await User.findOne({where:{user_id: req.params.userId}, raw: true});
        await Update.create({
            update_title: req.body.updateTitle,
            update_message: req.body.updateMessage,
            task_id: req.params.taskId,
            user_id: req.params.userId
        }).then(updated => {
            let grab = updated.update_time.toString(); 
            let date = grab.split('T');
            const str = updated.update_title + "~" + updated.update_message + "~" + name.user_name + " - " + date[0].replace("GM", "");
            res.send(str);
        });

    } catch (err) {
        console.log(err);
        res.render('error');
    }
});










////////////////////////////////////////////////////////////////////////////////////


















//////////////////////////STATS PAGE//////////////////////////////


userRouter.get('/:userId/:projectId/stats', async (req, res) => {
    const obj = await gatherTableInfo(req.params.projectId, req.params.userId);
    const projName = await Project.findOne({
        where: {proj_id: req.params.projectId},
        attributes: ["proj_name"],
        raw: true
    });
    res.render('statsPage', {obj, userId: req.params.userId, projId: req.params.projectId, projName: projName.proj_name});
});

userRouter.get('/:userId/:projectId/stats/getstats', async (req, res) => {
    try {
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
               
            })
            .catch(err => console.log(err));
        }
        

        const facultyLoop = async (list) => {
            for (let i = 0; i < list.length; i++) {
                const u_name = parseInt(list[i].USER);
                const t_name = parseInt(list[i].TASK);
                const userName = await User.findOne({
                    where: {user_id: u_name},
                    raw: true
                });
                const taskName = await Task.findOne({
                    where: {task_id: t_name},
                    raw: true
                });
                list[i].USERNAME = userName.user_name;
                list[i].TASKNAME = taskName.task_name;
            }
        }

        const userLoop = async (list) => {
            for (let i = 0; i < list.length; i++) {
                const t_name = parseInt(list[i].TASK);
                const taskName = await Task.findOne({
                    where: {task_id: t_name},
                    raw: true
                });
                list[i].TASKNAME = taskName.task_name;
            }
        }


        if (isFaculty) {
            await facultyLoop(a);
            a.sort(sortUserNames);
        } else {
            await userLoop(a);
        }        

        return {rows:a, isFaculty: isFaculty};

        


        
    }
    catch (err) {
        console.log(err);
    }
};

const sortUserNames = (a, b) => {
    if (a.USERNAME < b.USERNAME) return -1;
    if (a.USERNAME > b.USERNAME) return 1;
    return 0;
}

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