const mongoose = require('mongoose');
const Materials = mongoose.model('EssentiaMaterials');

//choose operation options
exports.populate = (req, res) => {
    if(req.body._id == ""){
        createRecords(req, res);
    }else{
        updateRecords(req, res);
    }
}

/* ***** INSERT NEW RECORDS TO ESSENTIA DB ***** */
function createRecords(req, res) {
    var date = new Date();
  var dateFormate = date.toLocaleDateString();
    var materials = new Materials();
    materials.category = req.body.category;
    materials.subCategory = req.body.subCategory;
    materials.item = req.body.item;
    materials.quantity = req.body.quantity;
    materials.desc = req.body.desc;
    materials.purpose = req.body.purpose;
    materials.remarks = req.body.remarks;
    materials.date = dateFormate;

    //saving
    materials.save((err) => {
        //keep an eye here
       if(!err){
        //grab the homepage card and update number here
        //include the popup notification success here
        console.log('Records saved to Essentia Materials')
        res.redirect('/projects/essentia/list');
        return;
       }
        
        //if there are empty fields
        if(err.name == 'ValidationError'){
            handleValidationError(err, req.body);
            res.status(400).render('projects/essentia/essentia-forms',{
                // warningError: 'Sorry, you have to fill in the required fields to continue',
                username: req.user.username,
                materials:req.body
            });
            return;
        }
    })
}

/* ***** UPDATE EXISTING RECORDS ***** */
function updateRecords(req, res){
    Materials.findOneAndUpdate({_id: req.body._id, }, req.body,{new:true}, (err, updated) => {

        //if there is an error
        if(err) return res.status(500).json({updateError: 'Could not update essentia Material records'});

        //if there is an empty field(s)
        if(err.name == "ValidationError"){
            handleValidationError(err, req.body);
            res.render('projects/essentia/essentia-forms',{
                username: req.user.username
            });
        }

        //if all things go well
        if(updated){
            console.log('essentia material updated!')
            redirect('/projects/essentia/list');
            return;
        }
    });
}

/* ***** GETTING ALL THE SUBMITTED RECORDS ***** */
exports.MaterialList = (req, res) => {
    Materials.find((err, docs) => {
        if(!err){
            res.render('projects/essentia/list', {
                list:docs
            });
            return;
        }
    });
}
/* ***** GETTING ITMES BY IDs FOR EDITING ***** */
exports.ids = (req, res) => {
    Materials.findById(req.params.id, (err, found) => {
        if(!err){
            res.render('projects/essentia/essentia-forms', {
                materials: found
            })
            return;
        }
    })
}

/* ***** DELETING EXISTING RECORDS ***** */
exports.deleteEssentiaMaterial = (req, res) => {
    Materials.findByIdAndRemove(req.params.id, (err, done) => {
        if(!err){
            //grap delete popup warning before proceeding
            res.redirect('/projects/essentia/list');
            return;
        }
    })
}

/* **** HANDLING EMPTY FIELD ERRORS ****/
function handleValidationError(err, body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'category':
                body['categoryError'] = err.errors[field].message;
                break;

            case 'subCategory':
                body['subCategoryError'] = err.errors[field].message;
                break;

            case 'item':
                body['itemError'] = err.errors[field].message;
                break;

            case 'quantity':
                body['quantityError'] = err.errors[field].message;
                break;

            case 'desc':
                body['descError'] = err.errors[field].message;
                break;
            
            case 'purpose':
                body['purposeError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

