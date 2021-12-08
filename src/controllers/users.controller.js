const usersController = {};

const passport = require('passport');
const jwt = require('jsonwebtoken');

const Users = require('../models/User');

usersController.grantAccess = function(action, resource) {
    return async (req, res, next) => {
      try {
        const permission = roles.can(req.user.role)[action](resource);
        if (!permission.granted) {
            req.flash('error_msg', 'No tienes permisos para ingresar en esta ruta.');
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  }

usersController.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersController.SignUp = async (req, res) => {
    const err = [];
    const {name, email, role, password, confirm_password} = req.body;
    if (password != confirm_password) {
        err.push({text: 'Las contraseñas no coinciden, compruebe su contraseña.'});
    }
    if (password.length < 4) {
        err.push({text: 'La contraseña debe tener al menos 4 caracteres.'})
    }
    if(err.length > 0) {
        res.render('users/signup',{
            err
        });
    }
    else {
        const emailUser = await Users.findOne({email: email});
        if (emailUser){
            req.flash('error_msg', 'El correo ya esta en uso');
            res.redirect('/signup');
        } else {
           const newUser =  new Users({name, email, password, role: role || 'admin'});
            newUser.password = await newUser.encryptPassword(password);
            req.flash('success_msg', 'Registrado Exitosamente!, Inicia Sesión para empezar.');
            const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
              });
              newUser.accessToken = accessToken;
           await newUser.save();
            res.redirect('/');
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

usersController.renderProfile = async (req, res) => {
    res.render('users/profile')
}

usersController.renderEditProfile = async (req, res) => {
    const user = await Users.findById(req.params.id);
    console.log(user);
    res.render('users/edit-profile', {user})
}
usersController.updateProfile = async (req, res) => {
    const { name, email } = req.body;
    const emailUser = await Users.findOne({email: email});
        //Comprobar si el correo ya esta en uso
        if (emailUser){
            req.flash('error_msg', 'El correo ya esta en uso, intente de nuevo.');
            res.redirect('/profile');
        } else {
            await Users.findByIdAndUpdate(req.params.id, {email})
            req.flash('success_msg', 'Tu Perfil ha sido actualizado');
            res.redirect('/profile');
        } if (name) {
            await Users.findByIdAndUpdate(req.params.id, {name})
            req.flash('success_msg', 'Tu Perfil ha sido actualizado');
            res.redirect('/profile'); 
        }
}

module.exports = usersController;