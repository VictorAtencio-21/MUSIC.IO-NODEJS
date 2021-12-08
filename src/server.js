const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const flash = require('connect-flash');
const session = require('express-session');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const path = require('path');
const passport = require('passport');
const { format } = require('timeago.js');
require('./database');
require("dotenv").config({
    path: path.join(__dirname, '../.env'),
})

// Inicializaciones
const app = express();
require('./config/passport')

// Ajustes
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', '.hbs');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Var. globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use((req, res, next) => {
    app.locals.format = format;
    next();
});


// Rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/music.routes'));
app.use(require('./routes/users.routes'));



// Archivos estaticos 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(function(req, res, next) {
    res.status(404).render('404');
  });

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8000';

app.listen(port, host, () => {
    console.log('App funcionando');
});

module.exports = app;