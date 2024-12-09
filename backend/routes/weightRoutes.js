const express = require('express');
const weightController = require('../controllers/weightController');
const router = express.Router();

// Mendefinisikan route untuk mendapatkan berat kendaraan
router.get('/weight', weightController.getWeight);

module.exports = router;
