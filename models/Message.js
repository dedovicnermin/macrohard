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



Message.belongsTo(Chatroom, {foreignKey: 'chat_id', onDelete: 'CASCADE'});
Chatroom.hasMany(Message);

Message.belongsTo(User, {foreignKey: 'user_id', onDelete: 'CASCADE'});
User.hasMany(Message);


module.exports = Message;