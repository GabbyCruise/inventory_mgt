const express = require('express');
const essentia = require('../controllerProjects/essentiaController');
const projects = express.Router();

/* ***** ESSENTIA ***** */
projects.route('/projects/essentia/essentia-forms')
    .post(essentia.populate);




module.exports = projects;
