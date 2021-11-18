const {Router} = require('express');
const router = Router();

const { renderIndex, renderAbout } = require('../controllers/index.controller');

router.get('/', renderIndex);

router.get('/about', renderAbout);

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/registro', (req, res) => {
    res.render('registro');
});

module.exports = router;