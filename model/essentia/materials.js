const mongoose = require('mongoose');

var EssentiaMaterialSchema = new mongoose.Schema({
    id: {
        type: String
    },
    date: {
        type: String
    },
    category: {
        type: String,
        required: 'This field is required!'
    },
    subCategory: {
        type: String,
        required: 'This field is required!'
    },
    item: {
        type: String,
        required: 'This field is required!'
    },
    quantity: {
        type: Number,
        required: 'This field is required!'
    },
    desc: {
        type: String,
        required: 'This field is required!'
    },
    purpose: {
        type: String,
        required: 'This field is required!'
    },
    remarks: {
        type: String,
        // required: 'This field is required!'
    }
});
mongoose.model('EssentiaMaterials', EssentiaMaterialSchema);
