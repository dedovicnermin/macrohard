const {DataTypes} = require('sequelize');
const db = require('../config/db');

const User = require("./User"),
    Task = require("./Task");

const UserTask = require('UserTask', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users"
        }
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "tasks"
        }
    }
}, {
    tableName: 'user_task',
    timestamps: false
});

User.belongsToMany(Task, {through: 'UserTask'});
Task.belongsToMany(User, {through: 'UserTask'});




module.exports = UserTask;