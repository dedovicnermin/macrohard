const {DataTypes} = require('sequelize');
const db = require('../config/db');
const Task = require('./Task');

const Submission = db.define('submission', {
    sub_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sub_doc: {
        type: DataTypes.BLOB("long")
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "tasks"
        }
    },
    sub_name: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'submissions',
    timestamps: false
});

// Submission.hasOne(Task);
Submission.hasOne(Task, {foreignKey: 'task_id'});
Task.hasMany(Submission, {foreignKey: 'task_id'});

module.exports = Submission