"use strict";

var express = require('express');

var weightController = require('../controllers/weightController');

var router = express.Router(); // Mendefinisikan route untuk mendapatkan berat kendaraan

router.get('/weight', weightController.getWeight);
module.exports = router;