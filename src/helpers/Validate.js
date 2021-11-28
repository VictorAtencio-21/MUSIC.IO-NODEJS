const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Inicia sesión para continuar');
    res.redirect('/signin');
};

module.exports = helpers;