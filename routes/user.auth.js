const express = require('express');
const user_auth = require('../auth/users.controller');
const passport = require('passport')
const route = express.Router();

/** ********* USER REGISTER********  */
route.route('/Authentication/register')
    .get((req, res) => {
        res.render('Authentication/register');
    })
    .post(user_auth.register);


    /** ****** VERIFY USERS ********* */
route.get('/activate/:token',user_auth.verifyUser);

/** ******** USER LOGIN************ */
route.route('/Authentication/login')
    .get((req, res) => {
        res.render('Authentication/login');
    })
     .post(user_auth.login);
     

/** ******** FORGOT PASSWORD ***** */
route.route('/Authentication/reset')
    .get((req, res, next) => {
        res.render('Authentication/reset');
    })
    .post(user_auth.resetPassword);


/** ********** Logout ********** */
route.get('/logout', user_auth.Logout);

module.exports = route;

