const mongoose = require('mongoose');
const Materials = mongoose.model('Newmaterials');//old
mongoose.set('useFindAndModify', true);

exports.populate1 = (req, res) => {
  if(req.body._id == ""){
    createRecords(req, res);
  }else{
    updateRecords(req, res);
  }
}


async function createRecords(req, res){
  //adding date to every item created
  var date = new Date();
  var formatDate = date.toLocaleDateString();

  var materialItems = new Materials(); 
    materialItems.category =  req.body.category;
    materialItems.subCategory = req.body.subCategory;
    materialItems.item =  req.body.item;
    materialItems.quantity = req.body.quantity;
    materialItems.desc =  req.body.desc;
    materialItems.purpose =  req.body.purpose;
    materialItems.remarks =  req.body.remarks;
    materialItems.date =  formatDate;
    materialItems.updatedDate = formatDate;
  
  
  //searching for category of material
  await Materials.findOne({category: materialItems.category}, (err, found) => {
    if(err) return res.status(500).json({msg: 'Unable to process this request!', err});

    //if material category is found, print it out for now
    if(found){

      //searching for sub category attached to the above category
      Materials.findOne({subCategory: materialItems.subCategory}, (err, subCatFound) => {
        if(err) return res.status(500).json({msg: 'Unable to process this request', err});

        //if material sub-category is found, print it out and continue search
        if(subCatFound){         

          //Searching for Item attached to the above subcategory
          Materials.findOne({item: materialItems.item}, (err, itemFound) => {
            if(err) return res.status(500).json({msg1: 'Unable to process this request'});

            //if cat, sub-cat, item is found, get new material quantity and add up below
            if(itemFound){

              //look for quantity and update it here
              var oldValue = parseFloat(itemFound.quantity);
              var newValue = parseFloat(materialItems.quantity);
              var addedValue = newValue + oldValue;
              var latestValue = {
                addedValue,
                updatedDate: materialItems.updatedDate
              }

              /** RULES OF UPDATING VALUES 
               * first paramter eg: _id defines the doc to update
               * second parameter defines the new values
               * Note: if _id > 1, the first is updated 
              */
              const options = {new: true};
              const option1 = {$inc: addedValue};
              Materials.findOneAndUpdate({materialId: latestValue,}, (err, updated) => {
               if(err) return res.status(500).json({updateErr: 'Update failed ' + err});
               if(updated) {
                 return;
               }
            });
                   
            }else{
              materialItems.save((err) => {
                if(err) return res.status(500).json({msg: 'Unable to create report', err});
              })
            }
          })
        }else{
          materialItems.save((err) => {
            if(err) return res.status(500).json({msg: 'Unable to create report', err});
          })
        }
      })
    }else{
      //material creation concluded
      materialItems.save((err) => {
        if(err) return res.status(500).json({msg: 'Unable to create new record'});
      })
    }
  });
}


function updateRecords(req, res){
  //this handles the update record function
}


/** ****** HANDLING EMPTY FIELD ERRORS* ****** */
function handleValidationError(err, body){
  for (field in err.errors){
    switch(err.errors[field].path){
      case 'category':
        body['categoryError'] = err.errors[field].message;
        break;

      case 'materialItems.':
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