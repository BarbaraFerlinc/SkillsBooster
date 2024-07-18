var express = require('express');
var router = express.Router();
const domenaController = require('../controllers/domenaController');

router.post('/dodaj', domenaController.dodajDomeno);
router.get('/vse', domenaController.vseDomene);
router.get('/:id', domenaController.najdiDomenoId);
router.post('/uporabnik', domenaController.najdiDomenoUser);
router.post('/lastnik', domenaController.najdiDomenoOwner);
router.put('/:id', domenaController.spremeniDomeno);
router.put('/uporabnik/:id', domenaController.dodajUporabnikaDomena);
router.put('/odstrani-uporabnika/:id', domenaController.odstraniUporabnikaDomena);
router.put('/kviz/:id', domenaController.dodajKvizDomena);
router.put('/odstrani-kviz/:id', domenaController.odstraniKvizDomena);
router.post('/gradivo', domenaController.dodajGradivoDomena);
router.post('/gradiva', domenaController.najdiGradiva);
router.post('/izbrisi-gradivo', domenaController.izbrisiGradivoDomena);
router.delete('/:id', domenaController.izbrisiDomeno);
router.post('/id', domenaController.najdiDomeno);

module.exports = router;