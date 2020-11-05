// const chatRouter = require('express').Router();



// chatRouter.get('/chat', function(req, res) {
//     res.render('chat');
// });


// var roomName;
// module.exports = function(io) {
//     io.on('connection', function (socket) {
//         console.log('user has connected to chat controller...');
//         socket.on('admin', function() {
//             console.log('Successful socket test');
//         });
//         // setTimeout(() => {
//         //     socket.emit('news', {description: "yaya"});
//         // }, 3000);

//         socket.on("joinRoom", (room)=> {
//             console.log("joined room" +room);
//             roomName = room;
//             socket.join(room);
//             io
//                 .to(room).emit("newUser", socket.username + " has entered the chat");
//             return io.emit("success", "You have joined this room called"+room);
//         })

//         socket.on('username', data => {
//             socket.username = data;
//             io.to(roomName).emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
//         });

//         socket.on('disconnect', username => {
//             io.to(roomName).emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
//         });

//         socket.on('chat_message', function(message) {
//             io.to(roomName).emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
//         });

//     });
    
//     return chatRouter;
// }