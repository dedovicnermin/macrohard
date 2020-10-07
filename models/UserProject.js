const {DataTypes} = require('sequelize');
const db = require('../config/db');

const User = require("./User"),
    Project = require("./Project");


const UserProject = db.define('UserProject', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users"
        }
    },
    proj_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'projects'
        }
    }
}, {
    tableName: 'user_project',
    timestamps: false
});

User.belongsToMany(Project, {through: 'UserProject'});
Project.belongsToMany(User, {through: 'UserProject'});

module.exports = UserProject;