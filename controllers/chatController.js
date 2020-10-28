const User = require('../models/User');
const chatRouter = require('express').Router();

Chatroom = require("../models/Chatroom"),
UserChatroom = require("../models/UserChatroom"),
Messages = require("../models/Message");

const db = require('../config/db');
const queryInterface = db.getQueryInterface();
var roomNumber;

chatRouter.get('/chat', function(req, res) {
    res.render('chatrooms')
})

chatRouter.get('/:roomNum', function(req, res) {
    roomNumber = req.params.roomNum;
    res.render('chat');
});



var roomName;
var time;


module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('user has connected to chat controller...');
        socket.join(roomNumber);
        socket.on('admin', function() {
            console.log('Successful socket test');
        });
        // setTimeout(() => {
        //     socket.emit('news', {description: "yaya"});
        // }, 3000);

        socket.on("joinRoom", async (room)=> {
            console.log("joined room" +room);
            roomName = room;
            //socket.join(room);
            

            // queryInterface.bulkInsert('chatrooms', [
            //     {
            //         task_id: null,
                    
            //     }
            // ]).then(() => {
            //     console.log('success');
            // }).catch(err => {
            //     console.log(`fail: ${err}`);
            // });

            const chatrooms = await UserChatroom.findAll({
                attributes: {
                    exclude: ['user_id']
                }
            });
            console.log(chatrooms);

            io
                .to(room).emit("newUser", socket.username + " has entered the chat");
            return io.emit("success", "You have joined this room called"+room);
        })

        socket.on('username', data => {
            socket.username = data;
            io.to(roomNumber).emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
        });

        socket.on('disconnect', username => {
            io.to(roomNumber).emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
        });

        socket.on('chat_message', function(message) {
            var currentdate = new Date();
            time = (currentdate.getMonth()+1)  + "/" 
             +currentdate.getDate() + "/"
            + currentdate.getFullYear() + " @ "  
            + (currentdate.getHours() %12) + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
            io.to(roomNumber).emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message + " :"+ time);
        });

        socket.on('addChat', data =>{
            console.log("the current user is " + data);
        })

    });
    
    return chatRouter;
}