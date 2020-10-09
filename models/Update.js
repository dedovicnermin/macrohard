const {DataTypes} = require('sequelize');
const db = require('../config/db');

const User = require("./User");
const Task = require("./Task");

const Update = db.define('update', {
    update_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    update_title: {
        type: DataTypes.STRING(100)
    },
    update_message: {
        type: DataTypes.STRING(750)
    },
    update_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tasks'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users'
        }
    }
}, {
   tableName: 'updates',
   timestamps: false
});

Update.hasOne(User);
User.hasMany(Update, {foreignKey: 'user_id'});

Update.hasOne(Task);
Task.hasMany(Update, {foreignKey: 'task_id'});





module.exports = Update;