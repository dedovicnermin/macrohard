const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render('loginPage')
};

exports.login = (req, res) => {

    User.findOne({
        where: {user_email: req.body.email},
        attributes: ['user_type', 'user_email', 'user_password', "user_id"]
    }).then(user => {
        if (user && user.user_password == req.body.password) {
            res.redirect(`/user/${user.user_id}/projects`);
        } else {
            res.render('loginPage', {loginError: "Incorrect email/password. Please try again."});
        }
    }).catch(err => {
        console.log(err);
        res.render('error');
    });

};


exports.getCreateAcount = (req, res) => {
    res.render('createAccountPage');
}

exports.createAccount = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}