var express = require('express');
var router = express.Router();
const companyController = require('../controllers/companyController');

router.post('/add', companyController.addCompany);
router.get('/all', companyController.allCompanies);
router.get('/:id', companyController.findCompany);
router.delete('/:id', companyController.deleteCompany);
router.put('/:id', companyController.changeCompany);

module.exports = router;