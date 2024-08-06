const express = require('express');
const router = express.Router();
const znanjeController = require('../controllers/znanjeController');

// Endpoint for AI model response
router.get('/model/:domain/:query', znanjeController.getModelResponse);

module.exports = router;
