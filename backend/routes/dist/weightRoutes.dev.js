"use strict";

// mweight/backend/routes/weightRoutes.js
var express = require('express');

var weightController = require('../controllers/weightController');

var router = express.Router(); // Define route to get vehicle weight

router.get('/weight', weightController.getWeight);
module.exports = router;