const {DataTypes} = require('sequelize');
const db = require('../config/db');
const Project = require('./Project');

const Group = db.define('group', {
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group_name: {
        type: DataTypes.STRING(50)
    },
    total_members: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    group_img: {
        type: DataTypes.STRING(50),
        defaultValue: 'default_img.jpg'
    },
    proj_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "projects",
            referencesKey: "proj_id"
        }
    }
}, {
    tableName: 'groups',
    timestamps: false,
    underscore: true
});


Project.hasMany(Group, {foreignKey: 'proj_id'});



module.exports = Group;