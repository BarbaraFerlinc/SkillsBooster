var express = require('express');
var router = express.Router();
const odgovorController = require('../controllers/odgovorController');

router.post('/dodaj', odgovorController.dodajOdgovor);
router.get('/vsi', odgovorController.vsiOdgovori);
router.get('/:id', odgovorController.najdiOdgovor);
router.put('/:id', odgovorController.spremeniOdgovor);
router.delete('/:id', odgovorController.izbrisiOdgovor);

module.exports = router;