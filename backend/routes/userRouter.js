var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.post('/add', userController.addUser);
router.get('/all', userController.allUsers);
router.post('/id', userController.findUser);
router.post('/adminEmail', userController.findUsersAdmin);
router.post('/bossEmail', userController.findUsersBoss);
router.delete('/:id', userController.deleteUser);

module.exports = router;