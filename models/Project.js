const {DataTypes} = require('sequelize');
const db = require('../config/db');

const Project = db.define('project', {
    proj_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    proj_name: {
        type: DataTypes.STRING(100)
    },
    proj_duedate: {
        type: DataTypes.DATEONLY
    },
    proj_membercount: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    proj_description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'projects',
    timestamps: false,
});

module.exports = Project;