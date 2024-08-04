var express = require('express');
var router = express.Router();
const kvizController = require('../controllers/kvizController');

router.post('/dodaj', kvizController.dodajKviz);
router.get('/vsi', kvizController.vsiKvizi);
router.get('/:id', kvizController.najdiKviz);
router.post('/ids', kvizController.najdiKvize);
router.put('/:id', kvizController.spremeniKviz);
router.put('/vprasanje/:id', kvizController.dodajVprasanjeKviz);
router.put('/odstrani-vprasanje/:id', kvizController.odstraniVprasanjeKviz);
router.post('/dodaj-rezultat', kvizController.dodajRezultatKviz);
router.post('/najdi-rezultat', kvizController.najdiRezultatKviz);
router.post('/spremeni-rezultat', kvizController.spremeniRezultatKviz);
router.put('/odstrani-rezultat/:id', kvizController.odstraniRezultatKviz);
router.delete('/:id', kvizController.izbrisiKviz);
router.post('/id', kvizController.najdiKviz);
//router.post('/avtPreverjanje', kvizController.dostopDoModelaKviz);
router.post('/avtPreverjanje', kvizController.avtPreverjanje);

module.exports = router;




