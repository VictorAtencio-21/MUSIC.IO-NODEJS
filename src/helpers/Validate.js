const helpers = {};

/*Autenticacion del Usuario para acceder a la aplicacion*/
helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Inicia sesión para continuar');
    res.redirect('/signin');
};


module.exports = helpers;