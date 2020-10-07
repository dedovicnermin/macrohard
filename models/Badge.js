const {DataTypes} = require('sequelize');
const db = require('../config/db');

const Badge = db.define('badge', {
    badge_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    badge_img: {
        type: DataTypes.STRING(50)
    },
    badge_name: {
        type: DataTypes.STRING(50)
    },
    badge_description: {
        type: DataTypes.STRING(150)
    }
}, {
    tableName: 'badges',
    timestamps: false
});



module.exports = Badge;