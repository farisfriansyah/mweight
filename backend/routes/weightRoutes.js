// mweight/backend/routes/weightRoutes.js
const express = require('express');
const weightController = require('../controllers/weightController');
const router = express.Router();

// Define route to get vehicle weight
router.get('/weight', weightController.getWeight);

module.exports = router;
