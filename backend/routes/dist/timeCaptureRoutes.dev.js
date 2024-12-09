"use strict";

var express = require('express');

var timeCaptureController = require('../controllers/timeCaptureController');

var router = express.Router(); // Route untuk menyimpan data capture

router.post('/capture', timeCaptureController.saveCapture);
module.exports = router;