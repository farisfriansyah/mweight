const express = require('express');
const weightController = require('../controllers/weightController');
const router = express.Router();

// Mendefinisikan route untuk mendapatkan berat kendaraan
router.get('/weight', weightController.getWeight);

// Mendefinisikan route untuk menyimpan data berat yang ditangkap
router.post('/weight/capture', weightController.captureWeight);

module.exports = router;
