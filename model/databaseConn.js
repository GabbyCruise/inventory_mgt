const mongoose = require('mongoose');
const url = 'YOUR-DB-URL-GOES-HERE';

mongoose.connect( url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err, done) => {
    try{
        if(!err) return console.log('Connected to InventoryDB');
    else{
        console.log('Connction Refused: ' + err);
    }

    }catch(err){
        return done(err)
    }
    
});

/* **** ADDING OTHER COLLECTIONS **** */

//authentication collection
require('./users/i_users');

//project collections => ESSENTIA
require('./essentia/materials');

//testing new envisaged procedure
require('./essentia/newMaterial');
