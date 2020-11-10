
const chatRouter = require('express').Router();

Chatroom = require("../models/Chatroom");
UserBadge = require('../models/UserBadge');
const db = require('../config/db');
const UserChatroom = require('../models/UserChatroom');
const Messages = require("../models/Message");
const queryInterface = db.getQueryInterface();
const User = require('../models/User');


var roomNumber;
var userID;

const sequelize = require('sequelize');
const Op = sequelize.Op;
const chatroomPageGather = async (userId) => {
    try {
        let chatIds = await getChatrooms(userId);
        let chatByUsernames = await getChatNames(userId, chatIds);

        return chatByUsernames;
    } catch (error) {
        console.log(error);
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
                    where: {chat_id: chatIds[i], [Op.ne] : userId},
                    attributes: ['user_id'],
                    raw: true
                });
                let twoloop = async () => {
                    
                    for (let j = 0; j < users.length; j++) {
                        let user = await User.findOne({
                            where: {user_id: users[j]},
                            attributes: ['user_name'],
                            raw: true
                        });
                        usersInChat.push(user.user_name);
                    }
                }
                await twoloop();
                let id = chatIds[i];
                chatByUsers.push({id: usersInChat});
            }
        }
        await loop();
        return chatByUsers;
    } catch (error) {
        console.log(error);
        return;
    }
}

async function getChatrooms(id) {
    try {
        let chatIds = [];
        const chats = await UserChatroom.findAll({
            where: {user_id: id},
            attributes: [chat_id],
            raw: true
        });
        chats.forEach(chat => {
            chatIds.push(chat.chat_id);
        });
        return chatIds;
    } catch (error) {
        console.log(error);
        return;
    }
    
    //returns array with chat_ids only.
}






chatRouter.get('/chat/:userID', async function(req, res) {
    try {
        const chats = await chatroomPageGather(req.params.userId);
        // res.render('chatrooms', {chatIDs: chats, user: users, userNames: usersOfChatroom});
        res.json(chats);
    } catch (error) {
        console.log(error);
        // res.render('error');
        res.json(error);
    }
    
});




















chatRouter.get('/:userID/:chatID', async function(req, res) {
    roomNumber = req.params.chatID;
    
    res.render('chat');
});





var roomName;
var time;
var chatID;




async function getUsersOfChatroom(chatrooms)
{
    var users = [];
    for (i = 0; i < chatrooms.length; i++)
    {
        var tmp = (await UserChatroom.findAll({
            where:
            {   
                chat_id :chatrooms[i].chat_id
            },  
            attributes: {
                exclude: ['chat_id']
            }
            
    
        }) );
        stringBuilder= "";
        for(j = 0; j < tmp.length; j++)
        {
            stringBuilder = stringBuilder + ((await User.findOne({
                where:
                {
                    user_id : tmp[j].user_id
                },
                attributes: {
                    exclude: ['user_type', 'user_email', 'user_password',"tasks_completed", "avg_contribution", "user_title", "user_phone", "user_location", "user_img"]
                }
            })).user_name)+", ";
            
        }
        var jsonElement = new Object();
        jsonElement.name = stringBuilder.replace(/,\s*$/, "");
        users.push(jsonElement)
    }
    return users;
}

async function getUserName(userID)
{
    var userName = await(User.findOne({
        where:
        {
            user_id: userID
        },
        attributes: {
            exclude: ['user_id','user_type', 'user_email', 'user_password',"tasks_completed", "avg_contribution", "user_title", "user_phone", "user_location", "user_img"]
        }
    }));

    return userName.user_name;
}

async function getMessages(chatID) {
    var messages = []
    getUserName(1);
    var message = await Messages.findAll({
        where : {
            chat_id : chatID
        },
        attributes: {
            exclude:['chat_id','msg_id']
        },
        order: [
            ['msg_id', 'ASC']
        ]
    });
    for( i = 0; i < message.length; i++)
    {
        var userName = await getUserName(message[i].user_id);
        var jsonObject = new Object();

        time =  " @ "  + ( message[i].msg_time/* .getTime() %12) + ":"  +  message[i].msg_time.getMinutes() */);
        jsonObject.msg_content =userName + " : " + message[i].msg_content + time;
        
        messages.push(jsonObject);
        
    }
    return messages;
}

// async function getUsers(user) {
//     var users = await User.findAll({
//         attributes: {
//             exclude: ['user_type', 'user_email', 'user_password',"tasks_completed", "avg_contribution", "user_title", "user_phone", "user_location", "user_img"]
//         }
        
//     });

//     return users;
// }
module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('user has connected to chat controller...');
        socket.join(roomNumber);
        socket.on('admin', function() {
            console.log('Successful socket test');
        });
 
        
        socket.on('getMessages', async data => {
            var tmp = await getMessages(data.chatId);
            socket.emit("receiveMessages"+data.chatId, {messages: tmp});
        })

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


        socket.on('addChatroom', async data =>{
                
               
                queryInterface.bulkInsert('chatrooms', [
                    {
                        task_id: null,
                    }
                ]).then(async () => {
                     chatID = await Chatroom.findOne({
                        where: {
                            
                        },
                        order: [
                            ['chat_id', 'DESC']
                        ]
                    });
            
                    chatID = chatID.chat_id;

                    queryInterface.bulkInsert('user_chatroom', [
                        {
                            user_id: parseInt(data[data.length-1]),
                            chat_id: chatID
                        }
                    ]).then(async () => {
                        for(i = 0; i < data.length-2; i++)
                        {
                            queryInterface.bulkInsert('user_chatroom', [
                                {
                                user_id: parseInt(data[i]),
                                chat_id: chatID
                                }
                            ]);
                            
                        }
                        
                    }).then(async() => {
                        socket.emit(data[data.length-1], chatID)
                    });
                    

                    
                    
                }).catch(err => {
                    console.log(`fail: ${err}`);
                });
                
            
        })

    });
    return chatRouter;
}
