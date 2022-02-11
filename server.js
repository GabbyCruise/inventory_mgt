const express = require('express');
const config = require('./headerFiles/config');
require('livereload');
require('./auth/passport.auth');
var app = express();

app.set('port', process.env.PORT || 2020);
app = config(app);



app.use(require('./routes/index'));
app.use(require('./routes/user.auth'));



/* **********BASIC MIDDLEWARE HANDLERS********** */
//404
app.use((req, res, next) => {
    res.status(404).send('Page Not Found, check your request & try again');
    next();
})

//500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server error occured!, sorry!!!');
    next();
});

//firing the app
app.listen(app.get('port'), function(){
    console.log('Inventory system started on : ' + app.get('port'));
});