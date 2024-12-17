"use strict";

// mweight/backend/routes/weightRoutes.js
var express = require('express');

var weightController = require('../controllers/weightController');

var router = express.Router(); // Gunakan getWeightApi untuk API request

router.get('/weight', weightController.getWeightApi);
module.exports = router;