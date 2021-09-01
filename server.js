const express = require('express');
const config = require('./headerFiles/config');
require('livereload');
// const routes = require('./routes/route');
require('./auth/passport.auth');
var app = express();

app.set('port', process.env.PORT || 2020);
app = config(app);


//getting routes
// app.use(routes);
app.use(require('./routes/index'));
app.use(require('./routes/user.auth'));
// app.use(require('./routes/projects'));



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

// my gotv id number: 4613574595

//firing the app
app.listen(app.get('port'), function(){
    console.log('Inventory system started on : ' + app.get('port'));
})
//!jF@gfb69x&TE4F
//checking for loop[ ]
var totalUsers = 10, displayValue = 0, temp = 0;
for(var i = 1; i <= totalUsers; i++){
  displayValue = temp + i;
}
// console.log('display Value is: ' + displayValue);
//EXPECTED OUTPUT: display value is: 10