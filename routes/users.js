const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const userRoute = require('../controllers/userRoutes');


router.route('/register')
    .get(userRoute.renderRegister)
    .post(catchAsync(userRoute.register));


router.route('/login')
    .get(userRoute.renderLogin)
    .post(passport.authenticate('local',{failureFlash: true,failureRedirect:'/login'}), userRoute.login);


router.get('/logout',userRoute.logout);
module.exports = router;