var express = require('express');
var router = express.Router();
const uporabnikController = require('../controllers/uporabnikController');

router.post('/dodaj', uporabnikController.dodajUporabnika);
router.get('/vsi', uporabnikController.vsiUporabniki);
router.get('/:id', uporabnikController.najdiUporabnika);
router.post('/adminEmail', uporabnikController.najdiUporabnikaAdmin);
router.post('/bossEmail', uporabnikController.najdiUporabnikaBoss);
router.put('/:id', uporabnikController.spremeniUporabnika);
router.delete('/:id', uporabnikController.izbrisiUporabnika);
router.post('/profil', uporabnikController.profilUporabnika);

module.exports = router;