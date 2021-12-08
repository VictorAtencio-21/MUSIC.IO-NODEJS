const {Router} = require('express');
const router = Router();
const {isAuthenticated} = require('../helpers/Validate');

const {renderSignUpForm,
    renderSignInForm,
    SignUp,
    SignIn,
    LogOut,
    renderProfile,
    updateProfile,
    renderEditProfile} = require('../controllers/users.controller')

router.get('/signup', renderSignUpForm);

router.post('/signup', SignUp);

router.get('/signin', renderSignInForm);

router.post('/signin', SignIn);

router.get('/logout', LogOut);

router.get('/profile',  isAuthenticated, renderProfile);

router.get('/profile/edit/:id',  isAuthenticated, renderEditProfile);

router.put('/profile/edit/:id', updateProfile);

module.exports = router;