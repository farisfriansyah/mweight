"use strict";

// mweight/backend/routes/weightHistoryRoutes.js
var express = require('express');

var weightHistoryController = require('../controllers/weightHistoryController');

var router = express.Router(); // Route untuk mendapatkan weight history

router.get('/weight-history', weightHistoryController.getWeightHistory);
router.get('/weight-history/daily', weightHistoryController.getDailyWeightHistory);
module.exports = router;