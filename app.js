"use strict";

const express = require("express"),
    app = express(),
    layouts = require("express-ejs-layouts"),
    logger = require('morgan'),
    errorController = require("./controllers/errors"),
    chatController = require("./controllers/chatController"),
    db = require("./config/db"),
    port = 3000;



app.set("view engine", "ejs");  
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));
const router = express.Router();


db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));


app.get("/", (req, res) => {
    res.send("Hello, World.");
});
app.get("/test", (req, res) => {
    res.render("test");
});
app.get('/chatroom', (req, res) => {
    app.use('chatroom', chatController);
});



//setting up routes to controllers
//app.use('/', userController)
//app.use('/admin', adminController)

//errorHandeling
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);


const UserChatroom = require('./models/UserChatroom');
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


module.exports = router ;






//  sass/ - front-end styling
//  config/ - defines db set up
//  controllers/ - defines our app routes and their logic
//  models/ - represents data, implements buisness logic and handles storage. interacts with our db. contains all methods and functions which will handle our data. 
//  public/ - contains all static files like images, styles and javascript
//  views/ - provides templates which are rendered and server by our routes
//  tests/ - tests everything which is in our folders
//  app.js - initializes the app and glues everything together
// package.json - remembers all packages that our app depends on + their versions