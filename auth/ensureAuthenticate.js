module.exports = {
    
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in first to continue!');
        res.redirect('/Authentication/login');
    },
    
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
    
        res.redirect('/welcome');
    }
};