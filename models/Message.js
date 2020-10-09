const {DataTypes} = require('sequelize');
const db = require('../config/db');

const Chatroom = require('./Chatroom');
const User = require('./User');

const Message = db.define('message', {
    msg_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    msg_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    chat_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'chatrooms'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users'
        }
    }
}, {
    tableName: 'messages',
    timestamps: false
});



Message.hasOne(Chatroom);
Chatroom.hasMany(Message, {foreignKey: 'chat_id'});

Message.hasOne(User);
User.hasMany(Message, {foreignKey: 'user_id'});


module.exports = Message;