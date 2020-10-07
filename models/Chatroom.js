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
            model: 'tasks'
        }
    }
}, {
    tableName: 'chatrooms',
    timestamps: false
});

Task.hasOne(Chatroom, {foreignKey: 'task_id'});
Chatroom.belongsTo(Task, {onDelete: 'CASCADE'});

module.exports = Chatroom;