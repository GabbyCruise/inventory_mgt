const mongoose = require('mongoose');
const Materials = mongoose.model('Newmaterials');//old
// const newMaterials = require('../model/essentia/newMaterial');
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
      console.log("Found materia category: " + found.category)//remove 

      //searching for sub category attached to the above category
      Materials.findOne({subCategory: materialItems.subCategory}, (err, subCatFound) => {
        if(err) return res.status(500).json({msg: 'Unable to process this request', err});

        //if material sub-category is found, print it out and continue search
        if(subCatFound){
          console.log('Found sub Category: ' + subCatFound.subCategory);//remove
          

          //Searching for Item attached to the above subcategory
          Materials.findOne({item: materialItems.item}, (err, itemFound) => {
            if(err) return res.status(500).json({msg1: 'Unable to process this request'});

            //if cat, sub-cat, item is found, get new material quantity and add up below
            if(itemFound){
              const materialId = itemFound._id;
              console.log('Item Id : ' + materialId);
              
              console.log('Found item item: ' + itemFound.item);//remove

              //look for quantity and update it here
              var oldValue = parseFloat(itemFound.quantity);
              var newValue = parseFloat(materialItems.quantity);
              var addedValue = newValue + oldValue;
              var latestValue = {
                addedValue,
                updatedDate: materialItems.updatedDate
              }
              console.log("Old value: " + oldValue)
              console.log('New value: ' + newValue);
              console.log('Updated Total value: ' + addedValue);

              /** RULES OF UPDATING VALUES 
               * first paramter eg: _id defines the doc to update
               * second parameter defines the new values
               * Note: if _id > 1, the first is updated 
              */
              const options = {new: true};
              const option1 = {$inc: addedValue};
              //Materials.findOneAndUpdate({_id: req.body._id, }, req.body,{new:true}, (err, updated) =>
             Materials.findOneAndUpdate({materialId: latestValue,}, (err, updated) => {
               if(err) return res.status(500).json({updateErr: 'Update failed ' + err});
               if(updated) {
                 console.log('Success updating value: ' + updated.quantity );
                 return;
               }
            });
                   
            }else{
              console.log('Material subcategory exist with no Item, you can create it here');
              //create item here and the rest of the contents
              materialItems.save((err) => {
                if(err) return res.status(500).json({msg: 'Unable to create report', err});
                console.log('New material with Item &  etc added!')
              })
            }
          })
        }else{
          console.log("Material category exist with no Subcategory, you can create it here");
          //create subcategory and the rest of the items
          materialItems.save((err) => {
            if(err) return res.status(500).json({msg: 'Unable to create report', err});
            console.log('New material sub category etc added to the db');
          })
        }
      })
    }else{
      //material creation concluded
      console.log('Material does not exist, you can create one here');
      materialItems.save((err) => {
        if(err) return res.status(500).json({msg: 'Unable to create new record'});
        console.log('New material item with ' + materialItems + 'added to the db')
      })
    }
  });
}


function updateRecords(req, res){
  //this handles the update record function
  console.log('Material update function called')
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

// materialItems.save((err) => {
      //   if(!err){
      //     return console.log("Material item with " + materialItems.category + " Saved to Essentia Database");
      //   }
      //   if(err.name == "ValidationError"){
      //     handleValidationError(err, req.body);
      //     res.status(400).render('profile/projects/essentia/essentia-reports', {
      //       materialItems:req.body
      //     });
      //   }else{
      //     console.log('No materials found for this record');
      //     return;
      //   }
      // })