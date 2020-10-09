const {DataTypes} = require('sequelize');
const db = require('../config/db');

const User = require("./User"),
    Badge  = require("./Badge");

const UserBadge = db.define('UserBadge', {
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    badge_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'badges'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            moodel: 'users'
        }
    }
}, {
    tableName: 'user_badge',
    timestamps: false
});

User.belongsToMany(Badge, {through: 'UserBadge', foreignKey: 'badge_id'});
Badge.belongsToMany(User, {through: 'UserBadge', foreignKey: 'user_id'});


module.exports = UserBadge;