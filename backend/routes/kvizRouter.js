var express = require('express');
var router = express.Router();
const kvizController = require('../controllers/kvizController');

router.post('/dodaj', kvizController.dodajKviz);
router.get('/vsi', kvizController.vsiKvizi);
router.get('/:id', kvizController.najdiKviz);
router.put('/:id', kvizController.spremeniKviz);
router.put('/vprasanje/:id', kvizController.dodajVprasanjeKviz);
router.put('/odstrani-vprasanje/:id', kvizController.odstraniVprasanjeKviz);
router.put('/rezultat/:id', kvizController.dodajRezultatKviz);
router.put('/odstrani-rezultat/:id', kvizController.odstraniRezultatKviz);
router.delete('/:id', kvizController.izbrisiKviz);

module.exports = router;