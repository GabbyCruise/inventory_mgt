const passport = require('passport');
const LocalStratey = require('passport-local');
const bcrypt = require('bcrypt');
const Users = require('../model/users/i_users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local', new LocalStratey({
    // failureFlash: 'Invalid username or password.' ,
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
}, async (email, password, done) => {
    try{
        /* ****** checking if email already exists *******/
        console.log('First output before operation fron passport.auth')
        const user = await Users.findOne({'email': email});
        if(!user){
            console.log('User is not found')
            done(null, false);
            return;
        }

        
        /* ******  Checks if email has been verified ****** */
        console.log('Second output before verificaiton')
        if(!user.active) {
            console.log('User found, but not verified yet')
            done(null, false);
            return;
        }

        /* ******* checking if password match ****** */
        console.log('Third output before password validation')
        bcrypt.compare(password, user.password,(err, matched) => {
            if(err) return done(null, false);
            if(!matched) {
                console.log('User found, user verified but password not matched')
                done(null, false);
                return;
            }
            else{
                console.log('Last output with success')
                console.log('User is found,user confirmed!, pass match, ')
                return done(null, user);
            }
        })

        

    }catch(error){
        return done(error, false);
    }
}))
