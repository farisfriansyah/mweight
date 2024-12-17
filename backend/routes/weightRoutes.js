// mweight/backend/routes/weightRoutes.js

const express = require('express');
const weightController = require('../controllers/weightController');
const router = express.Router();

// Gunakan getWeightApi untuk API request
router.get('/weight', weightController.getWeightApi);

module.exports = router;
