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
    },
    msg_content: {
        type: DataTypes.STRING(750)
    }
}, {
    tableName: 'messages',
    timestamps: false
});



Message.hasOne(Chatroom, {foreignKey: 'chat_id'});
Chatroom.hasMany(Message, {foreignKey: 'chat_id'});

Message.hasOne(User, {foreignKey: 'user_id'});
User.hasMany(Message, {foreignKey: 'user_id'});


module.exports = Message;