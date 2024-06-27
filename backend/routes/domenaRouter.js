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
router.put('/gradivo/:id', domenaController.dodajGradivoDomena);
router.put('/izbrisi-gradivo/:id', domenaController.izbrisiGradivoDomena);
router.delete('/:id', domenaController.izbrisiDomeno);

module.exports = router;