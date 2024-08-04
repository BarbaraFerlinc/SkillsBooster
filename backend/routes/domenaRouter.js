var express = require('express');
var router = express.Router();
const domenaController = require('../controllers/domenaController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/dodaj', domenaController.dodajDomeno);
router.get('/vse', domenaController.vseDomene);
router.get('/:id', domenaController.najdiDomenoId);
router.post('/uporabnik', domenaController.najdiDomenoUser);
router.post('/lastnik', domenaController.najdiDomenoOwner);
router.put('/:id', domenaController.spremeniDomeno);
router.put('/uporabnik/:id', domenaController.dodajUporabnikaDomena);
router.post('/uporabniki', domenaController.najdiUporabnikeDomena);
router.put('/odstrani-uporabnika/:id', domenaController.odstraniUporabnikaDomena);
router.post('/dodaj-kviz', domenaController.dodajKvizDomena);
router.post('/kvizi', domenaController.najdiKvizeDomena);
router.post('/odstrani-kviz', domenaController.odstraniKvizDomena);
router.post('/dodaj-rezultat', domenaController.dodajRezultatDomena);
router.post('/najdi-rezultat', domenaController.najdiRezultatDomena);
router.post('/spremeni-rezultat', domenaController.spremeniRezultatDomena);
router.put('/odstrani-rezultat/:id', domenaController.odstraniRezultatDomena);
router.post('/dodaj-gradivo', upload.single('file'), domenaController.dodajGradivoDomena);
router.post('/gradiva', domenaController.najdiGradivadomena);
router.post('/beri-gradivo', domenaController.beriGradivoDomena);
router.post('/izbrisi-gradivo', domenaController.izbrisiGradivoDomena);
router.delete('/:id', domenaController.izbrisiDomeno);
router.post('/id', domenaController.najdiDomeno);

module.exports = router;