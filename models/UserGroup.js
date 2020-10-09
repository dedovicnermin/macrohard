const {DataTypes} = require('sequelize');
const db = require('../config/db');

const User  = require("./User"),
      Group = require("./Group");

const UserGroup = db.define('UserGroup', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users'
        }
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'groups'
        }
    }
}, {
    tableName: 'user_group',
    timestamps: false
});

User.belongsToMany(Group, {through: 'UserGroup', foreignKey: 'group_id'});
Group.belongsToMany(User, {through: 'UserGroup', foreignKey: 'user_id'});



module.exports = UserGroup;