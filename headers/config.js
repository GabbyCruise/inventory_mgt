require('../model/databaseConn');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const handlebar = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookiePar = require('cookie-parser');
const passport = require('passport');
var sessionStore = new session.MemoryStore;

module.exports = (app) => {
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(cookiePar());
    
    //-------sessions configuration -----//
    app.use(session({
        cookie: {maxAge: 3600000},
        store: sessionStore,
        secret: 'little-secret-life-my-the-of',
        resave: false,
        saveUninitialized: false
    }));

    //-----------passport configuration -----------//
    app.use(passport.initialize());
    app.use(passport.session());

    //----------HANDLING FLASH MESSAGES -----------//
    app.use(flash());
    app.use(function(req, res, next) {
       res.locals.sessionFlash = req.session.sessionFlash;
       res.locals.mailError = req.flash('failure');
       res.locals.codeError = req.flash('failure1');
       res.locals.loginFirst = req.flash('error_msg');
       res.locals.mailNotFound = req.flash('unknown_email');
       res.locals.resetMessage = req.flash('resetMsg');
    //    res.locals.notVerified = req.flash('verify_error');
       res.locals.wrongPassword = req.flash('wrong_pass');
       res.locals.verifySuccess = req.flash('verified');
       res.locals.userIsVerified = req.flash('user_already_verified');
       res.locals.userVerifyNotFound = req.flash('no_user');
       res.locals.verifyError = req.flash('no_token');
       res.locals.wrongUidCode = req.flash('wrong_code');
       res.locals.regSuccess = req.flash('success_msg')
       delete req.session.sessionFlash;
       next();
    })

    //-----------VIEW ENGINE (HANDLEBARS)----------//
    app.engine('handlebars', handlebar.create({
        extname: 'handlebars',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
          },
          defaultLayout: 'root',
          layoutsDir: app.get('views') + '/layouts',
    }).engine)
    app.set('view engine', 'handlebars');

    app.use(logger('dev'));
    return app;
}
