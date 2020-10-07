const {DataTypes} = require('sequelize');
const db = require('../config/db');
const Project = require('./Project');

const ProjectFile = db.define('ProjectFile', {
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

ProjectFile.belongsTo(Project, {onDelete: 'CASCADE', foreignKey: 'proj_id'});
Project.hasMany(ProjectFile);

module.exports = ProjectFile;