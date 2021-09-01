const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//----------- USER SCHEMA CREDENTIALS -----------//
const userSchema = new Schema({
    username: String,
    email: String,
    uid: String,
    password: String,
    token: String,
    active: {
        type: Boolean,
        default: false,
    },   
},{ timestamps: true
    // timestamps: {
    //     createdAt: 'createdAt',
    //     updatedAt: 'updatedAt'
    // }
});

const User = mongoose.model('I_inventory_users', userSchema);

module.exports = User;