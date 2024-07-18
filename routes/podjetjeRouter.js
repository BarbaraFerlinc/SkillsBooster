var express = require('express');
var router = express.Router();
const podjetjeController = require('../controllers/podjetjeController');

router.post('/dodaj', podjetjeController.dodajPodjetje);
router.get('/vsa', podjetjeController.vsaPodjetja);
router.get('/:id', podjetjeController.najdiPodjetje);
router.delete('/:id', podjetjeController.izbrisiPodjetje);
router.put('/:id', podjetjeController.spremeniPodjetje);

module.exports = router;