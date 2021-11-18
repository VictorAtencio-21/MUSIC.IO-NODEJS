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

// Inicializaciones
const app = express();

// Ajustes
app.set('port', process.env.PORT || 4000);
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

// Var. globales


// Rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/admin.routes'));
app.use(require('./routes/music.routes'));


// Archivos estaticos 
app.use(express.static(path.join(__dirname, 'public'))); 


module.exports = app;