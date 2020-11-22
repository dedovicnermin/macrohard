
const express = require("express"),
    app = express(),
    layouts = require("express-ejs-layouts"),
    logger = require('morgan'),
    userController = require("./controllers/userController"),
    adminController = require("./controllers/adminController"),
    loginController = require('./controllers/loginController'),
    errorController = require("./controllers/errors"),
    db = require("./config/db"),
    port = 3000;







var server = app.listen(port);
app.io = require('socket.io')(server);
var chatController = require('./controllers/chatController')(app.io);

//for uploads
const fileRouter = express.Router();
const upload = require('./config/multerConfig')(__dirname);
require('./controllers/uploadController')(app, fileRouter, upload, __dirname);
app.locals.__basedir = __dirname;

app.set("view engine", "ejs");
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));


db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));


app.get("/", (req, res) => {
    res.redirect('/login');
});


app.get("/test", (req, res) => {
    res.render("test");
});

app.get("/login", loginController.getLogin);
app.post("/login", loginController.login);
app.get('/createaccount', loginController.getCreateAcount);
app.post('/createaccount', loginController.createAccount);

app.use("/messages", chatController);

app.use("/admin", adminController);

app.use("/user", userController);



//setting up routes to controllers
//app.use('/', userController)
//app.use('/admin', adminController)

//errorHandeling
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);










//  sass/ - front-end styling
//  config/ - defines db set up
//  controllers/ - defines our app routes and their logic
//  models/ - represents data, implements buisness logic and handles storage. interacts with our db. contains all methods and functions which will handle our data. 
//  public/ - contains all static files like images, styles and javascript
//  views/ - provides templates which are rendered and server by our routes
//  tests/ - tests everything which is in our folders
//  app.js - initializes the app and glues everything together
// package.json - remembers all packages that our app depends on + their versions
