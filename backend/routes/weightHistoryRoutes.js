// mweight/backend/routes/weightHistoryRoutes.js

const express = require('express');
const weightHistoryController = require('../controllers/weightHistoryController');
const router = express.Router();

// Route untuk mendapatkan weight history
router.get('/weight-history', weightHistoryController.getWeightHistory);
router.get('/weight-history/daily', weightHistoryController.getDailyWeightHistory);

module.exports = router;
