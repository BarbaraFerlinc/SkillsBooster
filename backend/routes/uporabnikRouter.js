var express = require('express');
var router = express.Router();
const uporabnikController = require('../controllers/uporabnikController');

router.post('/dodaj', uporabnikController.dodajUporabnika);
router.get('/vsi', uporabnikController.vsiUporabniki);
router.get('/:id', uporabnikController.najdiUporabnika);
router.delete('/:id', uporabnikController.izbrisiUporabnika);
router.put('/:id', uporabnikController.spremeniUporabnika);

module.exports = router;