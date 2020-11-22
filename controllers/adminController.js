const adminRouter = require('express').Router();

const Project = require("../models/Project"),
        User = require("../models/User"),
        Group = require("../models/Group"),
        Task = require('../models/Task'),
        Submission = require('../models/Submission'),
        Chatroom = require('../models/Chatroom'),
        UserProject = require('../models/UserProject'),
        UserGroup = require('../models/UserGroup'),
        UserTask = require('../models/UserTask'),
        UserChatroom = require('../models/UserChatroom'),
        UserBadge = require("../models/UserBadge"),
        ProjectFile = require('../models/ProjectFile'),
        sequelize = require('sequelize');

        
        
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

const homeGather = async () => {
    try {
//PROJECTS
        let ps = await Project.findAll({
            attributes: [
                [sequelize.fn('count', sequelize.col('proj_id')), 'proj_count']
            ],
            raw: true
        });
        let pObj = ps[0]; //pObj.proj_count

//USERS
        let u = await User.findAll({
            attributes: [
                [sequelize.fn('count', sequelize.col('user_id')), 'user_count']
            ],
            raw: true
        });
        let uObj = u[0]; //uObj.user_count

//GROUPS
        let g = await Group.findAll({
            attributes: [
                [sequelize.fn('count', sequelize.col('group_id')), 'group_count']
            ],
            raw: true
        });
        let gObj = g[0]; //gObj.group_count

//TASKS
        let t = await Task.findAll({
            attributes: [
                [sequelize.fn('count', sequelize.col('task_id')), 'task_count']
            ],
            raw: true
        });
        let tObj = t[0]; 

//SUBMISSIONS
        let s = await Submission.findAll({
            attributes: [
                [sequelize.fn('count', sequelize.col('sub_id')), 'sub_count']
            ],
            raw: true
        });
        let sObj = s[0];

//CHATROOMS
        let c = await Chatroom.findAll({
            attributes: [
                [sequelize.fn('count', sequelize.col('chat_id')), 'chat_count']
            ],
            raw: true
        });
        let cObj = c[0];

        return {
            pCount: pObj.proj_count,
            uCount: uObj.user_count,
            gCount: gObj.group_count,
            tCount: tObj.task_count,
            sCount: sObj.sub_count,
            cCount: cObj.chat_count
        }
    } catch (error) {
        console.log(error);
    }
    

}
adminRouter.get('/home', async (req, res) => {
    try {
        const {pCount, uCount, gCount, tCount, sCount, cCount} = await homeGather();
        res.render('admin/homePage', {pCount, uCount, gCount, tCount, sCount, cCount});
    } catch (error) {
        console.log('error');
        res.render('error');
    }
});


//showing options of what admin can create (faculty members and projects)
adminRouter.get('/create', (req, res) => {
    res.render('admin/createPage');
});

adminRouter.get('/delete', async (req, res) => {
    try {
        let projects = await Project.findAll({
            attributes: ['proj_id', 'proj_name', 'proj_membercount', 'proj_duedate'],
            raw: true,
            order: [
                ['proj_id', 'ASC']
            ]
        });
        let users = await User.findAll({
            attributes: ['user_id', 'user_name', 'user_email', 'user_type'],
            raw: true,
            order: [
                ['user_id', 'ASC']
            ],
            where: {
                user_type: {
                    [sequelize.Op.not]: 'ADMIN'
                }
            }
        });
        res.render('admin/deletePage', {projects: projects, users: users});
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});







adminRouter.post('/deleteuser/:userId', async (req, res) => {
    try {
        await User.destroy({
            where: {user_id: req.params.userId}
        });

        res.redirect('http://localhost:3000/admin/delete');
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});

adminRouter.post('/deleteproj/:projId', async (req, res) => {
    try {
        await Project.destroy({
            where: {proj_id: req.params.projId}
        });
    
        
        res.redirect('http://localhost:3000/admin/delete');
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});




adminRouter.post('/createuser', (req, res) => {
    User.create({
        user_name: req.body.name,
        user_email: req.body.email,
        user_password: 'the_best_password',
        user_type: 'FACULTY'
    }).then(fresh => {
        let str = fresh.user_name + "~" + fresh.user_email + "~" + fresh.user_password;
        res.send(str);
    }).catch(err => {
        console.log(err);
        res.send('Error. Please try that again!');
    });
});

adminRouter.post('/createproj', async (req, res) => {
    try {
        let facultyInSystem = await User.findOne({
            where: {user_email: req.body.facultyEmail},
            attributes: ['user_id', "user_name"],
            raw: true
        });
        if (!facultyInSystem) {
            res.send('The faculty email could not be found. Please try again.')
        }
        
        let proj = await Project.create({
            proj_name: req.body.projName,
            proj_duedate: new Date(req.body.due)
        });

        await UserProject.create({
            user_id: facultyInSystem.user_id,
            proj_id: proj.proj_id
        });
        let str = proj.proj_name + "~" + proj.proj_duedate + "~" + facultyInSystem.user_name;  
        
        res.send(str);
        
    } catch (error) {
        console.log(error);
        res.send('Error. Please try that again!');
    }
});























module.exports = adminRouter;