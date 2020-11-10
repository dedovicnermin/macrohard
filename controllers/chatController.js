
const chatRouter = require('express').Router();

const Chatroom = require("../models/Chatroom");
const UserBadge = require('../models/UserBadge');
const db = require('../config/db');
const UserChatroom = require('../models/UserChatroom');
const Messages = require("../models/Message");
const queryInterface = db.getQueryInterface();
const User = require('../models/User');

var roomNumber;
var userID;
// chatRouter.get('/chat/:userID', async function(req, res) {
//     try {
//         userID = req.params.userID;
//         var chats = await getChatrooms();
//         var users = await getUsers(userID);
//         var usersOfChatroom = await getUsersOfChatroom(chats);
//         delete users[(users.findIndex(obj => obj.user_id == userID))];
//         users.filter(n => n);
//         res.render('chatrooms', {chatIDs: chats, user: users, userNames: usersOfChatroom});
//     //res.json({chatIDs: chats, user: users, userNames: usersOfChatroom});
//     } catch (error) {
//         console.log(error);
//         res.render('error');
//     }
    
// });




const sequelize = require('sequelize');
// const Chatroom = require('../models/Chatroom');
const Op = sequelize.Op;
const chatroomPageGather = async (userId) => {
    try {
        let chatIds = await getChatrooms(userId);
        console.log(chatIds);
        let chatByUsernames = await getChatNames(userId, chatIds);

        return chatByUsernames;
    } catch (error) {
        console.log(error);
        console.log('inside chatroomgather');
        return;
    }
}


const getChatNames = async (userId, chatIds) => {
    try {
        let chatByUsers = [];
        let loop = async () => {
            for (let i = 0; i < chatIds.length; i++) {
                const usersInChat = [];
                const users = await UserChatroom.findAll({
                    where: {chat_id: chatIds[i], user_id: {
                        [Op.ne] : userId
                    }},
                    attributes: ['user_id'],
                    raw: true
                });
                let twoloop = async () => {
                    
                    for (let j = 0; j < users.length; j++) {
                        let u = users[j].user_id;
                        let user = await User.findOne({
                            where: {user_id: u},
                            attributes: ['user_name'],
                            raw: true
                        });
                        console.log(user.user_name);
                        usersInChat.push(user.user_name);
                    }
                }
                await twoloop();
                
                let obj = {};
                obj.cId = chatIds[i];
                obj.members = usersInChat;
                
                
                chatByUsers.push(obj);
            }
        }
        await loop();
        return chatByUsers;
    } catch (error) {
        console.log(error);
        console.log("inside double loop")
        return;
    }
    
}

const getChatrooms = async (id) => {
    try {
        let chatIds = [];
        const chats = await UserChatroom.findAll({
            where: {user_id: id},
            attributes: ['chat_id'],
            raw: true
        });
        chats.forEach(chat => {
            chatIds.push(chat.chat_id);
        });
        return chatIds;
    } catch (error) {
        console.log(error);
        console.log('inside get chatroomIds');
        return;
    }
    
    //returns array with chat_ids only.
}






chatRouter.get('/chat/:userID', async function(req, res) {
    try {
        const chatrooms = await chatroomPageGather(req.params.userID);
        // res.render('chatrooms', {chatIDs: chats, user: users, userNames: usersOfChatroom});
        // res.json(chats);
        res.render('chatrooms', {chatrooms, userId: req.params.userID});
    } catch (error) {
        console.log(error);
        // res.render('error');
        res.json(error);
    }
    
});

chatRouter.post('/chat/:userId', async (req, res) => {
    //takes list of emails and creates a new chatroom
    //needs to find user ID of each email, including self, and add to UserChat
    try {
        const emails = req.body.emails;
        await emailToUIDandInput(emails, req.params.userId);
        res.redirect(`http://localhost:3000/messages/chat/${req.params.userId}`);

    } catch (error) {
        console.log(error);
        res.render('error');
    }
});

const emailToUIDandInput = async (emails, selfId) => {
    try {
        let uIds = [];
        uIds.push(selfId);
        

        const chatroom = await Chatroom.create({
            task_id: null
        });

        const userChatInput = async () => {
            for (let i = 0; i < emails.length; i++) {
                const u = await User.findOne({
                    where: {user_email: emails[i]},
                    attributes: ['user_id'],
                    raw: true
                });
                uIds.push(u.user_id);
            }
        };
        await userChatInput();
        const inputToUserChat = async () => {
            for (let i = 0; i < uIds.length; i++) {
                await UserChatroom.create({
                    user_id: uIds[i],
                    chat_id: chatroom.chat_id
                });
            }
        };
        await inputToUserChat();
        return;
        
    } catch (error) {
        console.log(error);
        return;
    }
}







chatRouter.get('/:userId/:chatId', async (req, res) => {
    try {
        const msgs = await retrieveMessages(req.params.chatId, req.params.userId);
        msgs.forEach(msg => {
            let time = msg.msg_time;
            let splitTime = time.toString().split('GMT');
            msg.msg_time = splitTime[0];
        });
        //passUserID to page
        res.json(msgs);
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});

const retrieveMessages = async (chatId, selfId) => {
    try {
        const messages = await Messages.findAll({
            where: {chat_id: chatId},
            order: [
                ['msg_time', 'ASC']
            ],
            raw: true
        });

        return messages;
        
    } catch (error) {
        console.log(error);
        return;
    }
}























module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('user has connected to chat controller...');
        
        socket.join(roomNumber);
        socket.on('admin', function() {
            console.log('Successful socket test');
        });
 
        
        // socket.on('getMessages', async data => {
        //     var tmp = await getMessages(data.chatId);
        //     socket.emit("receiveMessages"+data.chatId, {messages: tmp});
        // })

        socket.on('chat_message', async data => {

           
            var currentdate = new Date();
            time =  " @ "  + (currentdate.getHours() %12) + ":"  + currentdate.getMinutes();

           queryInterface.bulkInsert('messages' , [
                {
                    chat_id: parseInt(data.room),
                    user_id: parseInt(data.user),
                    msg_content: data.message
                }
            ]) 

            var user = await User.findOne({
                where: {
                    user_id: data.user
                },
                attributes: {
                    exclude: ['user_type', 'user_email', 'user_password',"tasks_completed", "avg_contribution", "user_title", "user_phone", "user_location", "user_img"],
                    
                }
        
            });
            io.to(data.room).emit('chat_message', '<strong>' + user.user_name + '</strong>: ' + data.message + " :"+ time);
        });


        

    });
    return chatRouter;
}
