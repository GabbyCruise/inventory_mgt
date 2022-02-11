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
        const user = await Users.findOne({'email': email});
        if(!user){
            console.log('User is not found')
            done(null, false);
            return;
        }

        
        /* ******  Checks if email has been verified ****** */
        if(!user.active) {
            done(null, false);
            return;
        }

        /* ******* checking if password match ****** */
        bcrypt.compare(password, user.password,(err, matched) => {
            if(err) return done(null, false);
            if(!matched) {
                done(null, false);
                return;
            }
            else{
                return done(null, user);
            }
        })

        

    }catch(error){
        return done(error, false);
    }
}))
