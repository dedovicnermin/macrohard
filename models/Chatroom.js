const {DataTypes} = require('sequelize');
const db = require('../config/db');

const Task = require('./Task');

const Chatroom = db.define('chatroom', {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tasks',
            referencesKey: 'task_id'
        }
    }
}, {
    tableName: 'chatrooms',
    timestamps: false
});

<<<<<<< HEAD
// Chatroom.hasOne(Task);
// Task.hasOne(Chatroom, {foreignKey: 'task_id'});
=======
Chatroom.hasOne(Task, {foreignKey: 'task_id'});
Task.hasOne(Chatroom, {foreignKey: 'task_id'});
>>>>>>> master



module.exports = Chatroom;