const {DataTypes} = require('sequelize');
const db = require('../config/db');


const User = db.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING(50)
    },
    user_type: {
        type: DataTypes.STRING(15)
    },
    user_email: {
        type: DataTypes.STRING(50)
    },
    user_password: {
        type: DataTypes.STRING(25)
    },
    tasks_completed: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    avg_contribution: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },
    user_title: {
        type: DataTypes.STRING(100)
    },
    user_phone: {
        type: DataTypes.STRING(25)
    },
    user_location: {
        type: DataTypes.STRING(100)
    },
    user_img: {
        type: DataTypes.STRING(50),
        defaultValue: 'default_img.png'
    }
}, {
    tableName: 'users',
    timestamps: false
});






module.exports = User;

