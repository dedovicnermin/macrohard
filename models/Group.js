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
            model: "projects"
        }
    }
}, {
    tableName: 'groups',
    timestamps: false
});

Group.belongsTo(Project, {onDelete: 'CASCADE', foreignKey: 'proj_id'});
Project.hasMany(Group);



module.exports = Group;