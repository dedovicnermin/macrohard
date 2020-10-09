const {DataTypes} = require('sequelize');
const db = require('../config/db');

const User = require("./User"),
    Task = require("./Task");

const UserTask = db.define('UserTask', {
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

User.belongsToMany(Task, {through: 'UserTask', foreignKey: 'task_id'});
Task.belongsToMany(User, {through: 'UserTask', foreignKey: 'user_id'});




module.exports = UserTask;