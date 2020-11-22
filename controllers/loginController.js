const User = require('../models/User');
const UserBadge = require('../models/UserBadge');

exports.getLogin = (req, res) => {
    res.render('loginPage')
};

exports.login = (req, res) => {

    User.findOne({
        where: {user_email: req.body.email},
        attributes: ['user_type', 'user_email', 'user_password', "user_id"]
    }).then(user => {
        if (user && user.user_password == req.body.password) {
            if (user.user_type == "ADMIN") res.redirect('/admin/home');
            res.redirect(`/user/${user.user_id}/projects`);
        } else {
            res.render('loginPage', {loginError: "Incorrect email/password. Please try again."});
        }
    }).catch(err => {
        console.log(err);
        res.render('loginPage');
    });

};


exports.getCreateAcount = (req, res) => {
    res.render('createAccountPage');
}

exports.createAccount = async (req, res) => {
    try {
        if (req.body.password == req.body.confirmpassword) {
            const user = await User.create({
                user_type: 'USER',
                user_email: req.body.Email,
                user_name: req.body.fullname,
                user_password: req.body.password
            });
            if (user) {
                let loop = async () => {
                    for (let i = 1; i < 8; i++) {
                        await UserBadge.create({
                            user_id: user.user_id,
                            badge_id: i
                        });
                    }
                }
                await loop();
                res.redirect('http://localhost:3000/user/' + user.user_id + '/projects');
            }
        
        }
        res.render('createAccountPage', {errorMessage: "There was an error in creating your account."});
        
    } catch (error) {
        console.log(error);
        res.redirect('/createaccount');
    }
}