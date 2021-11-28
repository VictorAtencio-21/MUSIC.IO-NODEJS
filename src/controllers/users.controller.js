const usersController = {};

const passport = require('passport');

const Users = require('../models/User');

usersController.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersController.SignUp = async (req, res) => {
    const err = [];
    const {name, email, password, confirm_password} = req.body;
    if (password != confirm_password) {
        err.push({text: 'Las contraseñas no coinciden, compruebe su contraseña.'});
    }
    if (password.length < 4) {
        err.push({text: 'La contraseña debe tener al menos 4 caracteres.'})
    }
    if(err.length > 0) {
        res.render('users/signup',{
            err
        } )
    }
    else {
        const emailUser = await Users.findOne({email: email});
        if (emailUser){
            req.flash('error_msg', 'El correo ya esta en uso');
            res.redirect('/signup');
        } else {
           const newUser =  new Users({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            req.flash('success_msg', 'Registrado Exitosamente!');
           await newUser.save();
           res.redirect('/signin');
        }
    }
};

usersController.renderSignInForm = (req, res) => {
    res.render('users/signin');
};

usersController.SignIn = passport.authenticate('local', {
    failureRedirect: '/signin',
    successRedirect: '/dash',
    failureFlash: true
})

usersController.LogOut= (req, res) => {
    req.logout();
    req.flash('success_msg', 'Cerraste Sesión.');
    res.redirect('/signin');
}

module.exports = usersController;