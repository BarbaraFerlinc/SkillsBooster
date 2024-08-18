var express = require('express');
var router = express.Router();
const companyController = require('../controllers/companyController');

router.post('/add', companyController.addCompany);
router.get('/all', companyController.allCompanies);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;