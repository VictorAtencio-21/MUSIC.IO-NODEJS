const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    //Confirmar si coincide el correo del usuario
    const UserAuth = await User.findOne({email})
    if (!UserAuth) {
        return done(null, false, {message: 'Usuario no econtrado.'});
    } else {
        //Validar contraseña
       const match = await UserAuth.matchPassword(password);
       if (match) {
           return done(null, UserAuth);
       } else {
           return done(null, false, {message: 'Contraseña Incorrecta.'})
       }
    }
}));

passport.serializeUser((UserAuth, done) => {
    done(null, UserAuth.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, UserAuth) => {
        done(err, UserAuth);
    });
});