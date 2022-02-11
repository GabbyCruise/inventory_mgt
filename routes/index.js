const express = require("express");
const mongoose = require('mongoose');
const authenticateUser = require("../auth/ensureAuthenticate");
const Users = require('../model/users/i_users');
const Materials = mongoose.model('Newmaterials');
const EssentiaMaterial = require('../model/essentia/materials');
const essentia = require("../controllerProjects/essentiaController");
const newEssentia = require('../controllerProjects/newTestingController');
const router = express.Router();

// ---------- GETTING THE HOMEPAGE ---------//
router.get("/", (req, res) => {
  res.render("index");
});

//------------ Dashboard Route ------------//
router.get("/welcome", /*authenticateUser.ensureAuthenticated, */(req, res) => {
    var count = 0; temp = 0;
      res.render("welcome", {
        totalEssentia: count
      });
    
    }
);

/* ********** accessing other resources while logged in ******* */
//---------- essentia projects page ------//
router.route("/projects/essentia/essentia-forms")
  .get(/*authenticateUser.ensureAuthenticated,*/(req, res) => {
      res.render("projects/essentia/essentia-forms", {
        //username: req.user.username
      });
    }
  )
  .post(/*authenticateUser.ensureAuthenticated, */newEssentia.populate1);


router.route('/projects/lifestyle/lifestyle-forms')
  .get(/*authenticateUser.ensureAuthenticated,*/ (req, res) => {
    res.render('projects/lifestyle/lifestyle-forms', {
      //username: req.user.username
    });
  });


router.route('/projects/regency/regency-forms')
  .get(/*authenticateUser.ensureAuthenticated,*/ (req, res) => {
    res.render('projects/regency/regency-forms', {
      //username: req.user.username
    });
  });

router.route('/projects/zephyr/zephyr-forms')
  .get(/* authenticateUser.ensureAuthenticated, */ (req, res) => {
    res.render('projects/zephyr/zephyr-forms', {
      //username: req.username;
    });
  });

router.get("/projects/essentia/list", essentia.MaterialList);

//-------- report item veiw -----------//
router.get("/projects/essentia/material-view", /*authenticateUser.ensureAuthenticated, */(req, res) => {
    // const materialDesc = "No material display for now";
    res.render("projects/essentia/material-view", {
      //username: req.user.username
    });
  }
);

//---------- notification page -----------//
router.get("/notification", /*authenticateUser.ensureAuthenticated,*/ (req, res) => {
    res.render("notification", {
      //username: req.user.username
    });
  }
);
module.exports = router;
