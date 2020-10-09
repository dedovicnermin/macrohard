const {DataTypes} = require('sequelize');
const db = require('../config/db');
const Project = require('./Project');

const ProjectFile = db.define('ProjectFile', {
    proj_file_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    proj_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'projects'
        }
    },
    file: {
        type: DataTypes.BLOB
    }
}, {
    tableName: 'project_files',
    timestamps: false
});

ProjectFile.hasOne(Project);
Project.hasMany(ProjectFile, {foreignKey: 'proj_id'});

module.exports = ProjectFile;