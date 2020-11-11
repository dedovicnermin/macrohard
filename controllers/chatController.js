
const chatRouter = require('express').Router();
const Chatroom = require("../models/Chatroom");
const UserChatroom = require('../models/UserChatroom');
const Messages = require("../models/Message");
const User = require('../models/User');






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
        res.render('chatrooms', {chatrooms, userId: req.params.userID});
    } catch (error) {
        console.log(error);
        res.render('error');
        
    }
    
});

chatRouter.post('/chat/:userId', async (req, res) => {
    //takes list of emails and creates a new chatroom
    //needs to find user ID of each email, including self, and add to UserChat
    try {
        const es = req.body.emails;
        const emails = es.toString().split('\n');
        
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
            for (let i = 0; i < emails.length - 1; i++) {
                let e = emails[i].trim().replace(/^[ '"]+|[ '"]+$|( ){2,}/g,'$1');
                const u = await User.findOne({
                    where: {user_email: e},
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
        const messages = await formatMsg(msgs);

        //passUserID to page
        // res.json(messages);

        res.render('chat', {messages, userId: req.params.userId});
    } catch (error) {
        console.log(error);
        res.render('error');
    }
});


const formatMsg = async (msgs) => {
    try {
        const loop = async () => {
            for (let i = 0; i < msgs.length; i++) {
                const name = await User.findOne({
                    where: {user_id: msgs[i].user_id},
                    attributes: ['user_name', 'user_img'],
                    raw: true
                });
                msgs[i].userName = name.user_name;
                msgs[i].img = name.user_img;
            }
        };
        await loop();
        return msgs;

    } catch (error) {
        console.log(error);
        return -1;
    }

}


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
        const q = socket.handshake.query.userroom.toString().split('~');
        socket.userId = q[0];
        socket.chatId = q[1];
        socket.join(socket.chatId);
        console.log('user with userID: ' + socket.userId + ' has connected and is now in chatroomID: ' + socket.chatId);
        
 
        
        socket.on('postMsg', async (obj) => {
            try {
                const msg = await Messages.create({
                    chat_id: socket.chatId,
                    user_id: socket.userId,
                    msg_content: obj.msg
                });
                const user = await User.findOne({
                    where: {user_id: socket.userId},
                    attributes: ['user_name', 'user_img'],
                    raw: true
                });
                io.to(socket.chatId).emit('new_msg', {msg: msg, time: obj.time, userName: user.user_name, img: user.user_img});
            } catch (error) {
                io.to(socket.chatId).emit('new_msg');
            }
        });

        


        

    });
    return chatRouter;
}
