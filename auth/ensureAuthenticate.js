module.exports = {
    
    ensureAuthenticated: function (req, res, next) {
        console.log('First output from ensureAuthenticate.js')
        if (req.isAuthenticated()) {
            console.log('checking if user is authenticated 1............')
            return next();
        }
        console.log('User is not authenticated, return to login page')
        req.flash('error_msg', 'Please log in first to continue!');
        res.redirect('/Authentication/login');
    },
    
    forwardAuthenticated: function (req, res, next) {
        console.log('Second output from ensureAuthenticate')
        if (!req.isAuthenticated()) {
            console.log('checking if user is authenticated 2......')
            console.log('user is authenticated, redirecting to Dashboard!')
            return next();
        }
        // req.session.user = {
        //     username,
        // };
    
        res.redirect('/welcome');
    }
};