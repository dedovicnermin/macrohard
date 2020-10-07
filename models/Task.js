const {DataTypes} = require('sequelize');
const db = require('../config/db');
const Group = require("./Group");

const Task = db.define('task', {
    task_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task_name: {
        type: DataTypes.STRING(50)
    },
    task_description: {
        type: DataTypes.TEXT
    },
    task_status: {
        type: DataTypes.STRING(25),
        defaultValue: 'Not Complete'
    },
    task_score: {
        type: DataTypes.INTEGER
    },
    task_approval: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "groups"
        }
    }
}, {
    tableName: 'tasks',
    timestamps: false
});

Task.belongsTo(Group, {onDelete: 'CASCADE', foreignKey: 'group_id'});
Group.hasMany(Task);