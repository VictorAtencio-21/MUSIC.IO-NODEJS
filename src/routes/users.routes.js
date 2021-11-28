const {Router} = require('express');
const router = Router();

const {renderSignUpForm,
    renderSignInForm,
    SignUp,
    SignIn,
    LogOut} = require('../controllers/users.controller')

router.get('/signup', renderSignUpForm);

router.post('/signup', SignUp);

router.get('/signin', renderSignInForm);

router.post('/signin', SignIn);

router.get('/logout', LogOut);

module.exports = router;