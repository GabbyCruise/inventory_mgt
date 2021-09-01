const mongoose = require('mongoose');

//--------------- New Essentia Schema ------------------//

var newMaterialSchema = new mongoose.Schema({
    id: {
        type: String
    },
    date: {
        type: String
    },
    updatedDate: {
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
        type: String,
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
    },
});
mongoose.model('Newmaterials', newMaterialSchema);
