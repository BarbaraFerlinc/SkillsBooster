var express = require('express');
var router = express.Router();
const vprasanjeController = require('../controllers/vprasanjeController');

router.post('/dodaj', vprasanjeController.dodajVprasanje);
router.get('/vsi', vprasanjeController.vsaVprasanja);
router.get('/:id', vprasanjeController.najdiVprasanje);
router.post('/ids', vprasanjeController.najdiVprasanja);
router.put('/:id', vprasanjeController.spremeniVprasanje);
router.put('/odgovor/:id', vprasanjeController.dodajOdgovorVprasanje);
router.put('/odstrani-odgovor/:id', vprasanjeController.odstraniOdgovorVprasanje);
router.delete('/:id', vprasanjeController.izbrisiVprasanje);

module.exports = router;