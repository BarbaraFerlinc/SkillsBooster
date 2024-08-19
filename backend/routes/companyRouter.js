const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.post('/add', companyController.addCompany);
router.get('/all', companyController.allCompanies);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;