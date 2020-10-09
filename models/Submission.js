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
        type: DataTypes.BLOB
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "tasks"
        }
    }
}, {
    tableName: 'submissions',
    timestamps: false
});

Submission.hasOne(Task);
Task.hasMany(Submission, {foreignKey: 'task_id'});

module.exports = Submission