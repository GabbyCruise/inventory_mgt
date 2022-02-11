const express = require('express');
const Users = require('../model/users/i_users');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendMail = require('@sendgrid/mail');
// const { token } = require('morgan');
sendMail.setApiKey(process.env.SENDGRID_KEY_API);

/** ******* USER REGISTRATION HANDLER ***********  */
exports.register = async (req, res) => {
    const u0 = "Inv-0000-C";
    const u1 = "Inv-0001-C";
    const u2 = "Inv-0010-C";
    const u3 = "Inv-0011-C";
    const u4 = "Inv-0100-C";
    const u5 = "Inv-0101-C";
    const u6 = "Inv-0110-C";
    const u7 = "Inv-0111-C";
    const u8 = "Inv-1000-C";
    const u9 = "Inv-1001-C";
    const u10 = "Inv-1010-C";
    const u11 = "Inv-1011-C";
    const code = req.body.uid;
   
    if(code != u0 && code != u3 && code != u1 && 
        code != u2 && code != u4 && code != u5 && 
        code != u6 && code != u7 && code != u8 && 
        code != u9 && code != u10 && code != u11){
        req.flash('wrong_code', 'Sorry, you are not authorized to use this platform!')
        res.status(400).redirect('/Authentication/register')
        return;
    }else{
        
    try{
         //----- check for duplicate e-mail address -------//   
        Users.findOne({email: req.body.email}, (err, duplicate) =>{
            if(err) return res.status(500).json({errConnection: "There was a problem processing your request", err});

            if(duplicate){
                req.flash('failure', "This email is Already in use! Login Instead.");
                res.status(400).redirect('/Authentication/register');
                return;
            }

            // ----check for duplicate passcode and reject it -----//
            Users.findOne({uid: code}, (err, foundCode) => {
                if(err) return res.status(500).json({systemError: "Unable to process this request, please try again", err});

                if(foundCode){
                    req.flash('failure1', 'This code is already in use! Two users cannot share one passcode');
                    res.status(400).redirect('/Authentication/register');
                    return;    
                }
                
                // ----- if no duplicate email & passcode, hash password ------//  
                const password = req.body.password;
                bcrypt.hash(password, 10, function(err, hash) {
                    if(err) return res.status(500).json({hashFailed: 'There was an error hashing password', err});
                    
                    var chars = 'abcd1234efghi56IJKLMN7890vneiokfkjiuWIUOIE48mnopqrstUVWZXY01';
                    var token = '';
                    for(var i = 64; i > 0; --i){
                        token += chars[Math.round(Math.random() * (chars.length - 1))];
                    }

                    
                    users = new Users({
                        username: req.body.username,
                        email: req.body.email,
                        uid: req.body.uid,
                        password: hash,
                        token: token,
                    });

                    /** ****** SENDING A VERIFICATION EMAIL */
                    const client_url = 'http://' + req.headers.host;
                    const output = `
                        <h2>Please click on the below link to activate your account</h2>
                        <p> 
                        Hello <b> ${users.username}</b>, Welcome to CobuildiT Inventory System.
                        </p>

                        <p> Please use the below link to activate your account. After then will you be able to log into your account</p>
                        <p style="text-size: 2rem;">
                            <a href="${client_url}/activate/${token}"> Activate Account.</a>
                        </p>
                        <p><b>NOTE:</b> The link above should verify you and take you to the login page where you should sign into your dashboard. Should incase its not working for you, Please copy the below character to your browser and hit the enter key.
                        </p>
                        <p>
                        ${client_url}/activate/${token}.<br/>
                        Thanks..
                        </p>
                        `;

                    var mailOptions = {
                        from: 'Inventory Admin Signup <gabriel@6thgenerations.net>',
                        to: users.email,
                        subject: 'Account Activation Token',
                        html: output,
                    };
                    
                    sendMail.send(mailOptions, (err) => {
                        req.flash('failed', 'Sorry, Registration failed, Mail Not sent! Try again later');
                        if(err) {
                            return res.status(400).render('Authentication/register', {
                                userFail: req.flash('failed')
                            });
                        }else{
                            users.save((err, done) => {
                                if(err) return res.status(500).json({savingError: 'Unable to register this user! please try again', err});
                                if(done){
                                    req.flash('success_msg', "Registration Successful!, Please check your mail for a confirmation message!");
                                    return res.redirect('/Authentication/register');
                                }
                            })             
                        }
                    })
                });
            })
        });      
    }catch(error){
            res.status(500).json({processError: 'An error occured!, try again later', error})
        }
    }   
}


/** *************** VERIY NEW USERS HANDLER ************** */
exports.verifyUser = (req, res, next) => {
    req.flash('verify_error', 'No User with that ID  found!');
     
    //search for a token
    var sentToken = req.params.token;
    if(!sentToken){
        req.flash('no_token', 'No Token found for this user');
        res.status(500).render('Authentication/login')
        return;
    }

    try{
     // search for a user with this token   
    Users.findOne({token: sentToken}, (err, user) => {
        if(err) return res.status(500).json({processError: 'Unable to process this request now, please try again ' + err});

        if(!user){
            req.flash('no_user', 'No User found for this token');
            console.log('No user found for this token')
            res.status(400).redirect('/Authentication/login')
            return;
        }
        if(user.active){
            req.flash('user_already_verified', 'You have already been verified before!  Please Login now.')
            console.log('User has been verified already')
            res.status(400).redirect('/Authentication/login')
            return;
        }
        user.active = true;
        user.save();
 
        /** ****** SENDING A WELCOME EMAIL ON SUCCESSFUL VERIFICATION */
             //configure email properties
             const client_url = 'http://' + req.headers.host;
             const output = `
                 <h2>Welcome to CobuildIT Project Inventory Management System </h2>
                 <p> Hello <b>${user.username}</b>, 
                 <br/>This is Gabriel, the inventory admin. Thanks for signing up on the online Inventory management system.</p>
                 <p> 
                 This platform was created to help manage all CobuildiT project's inventory materials, material usage equipments etc. <br/>
                 Please be mindful of the transations you make on this platform as any mistake may jeopardize the integrity of the data contained thus leading to misinformation.
                 </p>
 
                 <p>
                 This is just a starter application. The rest of the functions will be rectified as it is being used and even new functions will be added in due time. <br/>
                 When this happens, a notification of new function update will be sent to you when there's any.
                 </p>
 
                 <p> For complaints and suggestions, please feel free to reach me on my contact details below.
 
                 <p>
                 I hope you'll have a good experience using this application.
                 </P>
                 <p>
                 <b>Email:</b> gjonah18@gmail.com<br/>
                 <b>Phone:</b> +234 706 345 4620<br/><br/>
                 Warm Regards -:)
                 
                 </p>
                 `;
 
             var mailOptions = {
                 from: 'Welcome to Inventory <gabriel@6thgenerations.net>',
                 to: user.email,
                 subject: 'Welcome to CobuildIT Inventory App',
                 html: output,
             };
             
             //sending email after confirmation
             sendMail.send(mailOptions, (err) => {
                 if(err) return res.json({mailError: 'System malfunctioned, you could not get the welcome email. but you can login because you have been verified ' + err});

                 req.flash('verified', 'Thank you, verification successful! You may now login');
                console.log('user verified and updated')
                res.redirect('/Authentication/login')
                return;
            });          
      })
    }catch(error){
        res.status(500).json({verificationError: 'We are Sorry this happened, the system malfunctioned. This maybe due to poor internet connection. Please try again later.'});
        return;
    }
}

// ************* LOGIN ********** //
exports.login = (req, res, next) => {
    req.flash('unknown_email', 'Unknown Email, Unverified Email or wrong password, . Please check and try again!')

   passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/Authentication/login',
    failureFlash: true
})(req, res, next);

}

/** ********* RESET USER PASSWORD ************** */
exports.resetPassword = (req, res, next) => {
    req.flash('resetMsg', "Sorry! This feature is deactivated for now!");
    res.redirect('/Authentication/reset');
}

exports.Logout = async(req, res, next) =>{
    req.logout();
    req.session.user = null;
    res.redirect("/Authentication/login");
}
