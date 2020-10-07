const {DataTypes} = require('sequelize');
const db = require('../config/db');

const User = require("./User"),
    Chatroom = require("./Chatroom");

const UserChatroom = db.define('UserChatroom', {
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
    tableName: 'user_chatroom',
    timestamps: false    
});


User.belongsToMany(Chatroom, {through: 'UserChatroom'});
Chatroom.belongsToMany(User, {through: 'UserChatroom'});


module.exports = UserChatroom;