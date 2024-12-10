"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProcessedWeightData = exports.getRawWeightData = exports.processWeightData = void 0;
// src/utils/weightUtils.js
var rawWeightData = null;
var processedWeightData = null; // Fungsi untuk memproses data berat kendaraan

var processWeightData = function processWeightData(rawData) {
  var weightValue = rawData.replace(/[^\d.-]/g, '');
  var processedWeight = parseFloat(weightValue).toFixed(1);
  rawWeightData = rawData;
  processedWeightData = processedWeight;
  return processedWeight;
};

exports.processWeightData = processWeightData;

var getRawWeightData = function getRawWeightData() {
  return rawWeightData;
};

exports.getRawWeightData = getRawWeightData;

var getProcessedWeightData = function getProcessedWeightData() {
  return processedWeightData;
};

exports.getProcessedWeightData = getProcessedWeightData;