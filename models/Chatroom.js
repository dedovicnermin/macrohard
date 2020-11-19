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

// Chatroom.hasOne(Task);
// Task.hasOne(Chatroom, {foreignKey: 'task_id'});



module.exports = Chatroom;