var express = require('express');
var router = express.Router();
const domainController = require('../controllers/domainController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', domainController.addDomain);
router.get('/all', domainController.allDomains);
router.post('/id', domainController.findDomain);
router.post('/user', domainController.findDomainUser);
router.post('/owner', domainController.findDomainOwner);
router.put('/:id', domainController.changeDomain);
router.put('/user/:id', domainController.addUserDomain);
router.post('/users', domainController.findUsersDomain);
router.put('/delete-user/:id', domainController.deleteUserDomain);
router.post('/add-quiz', domainController.addQuizDomain);
router.post('/quizzes', domainController.findQuizzesDomain);
router.post('/delete-quiz', domainController.deleteQuizDomain);
router.post('/add-result', domainController.addResultDomain);
router.post('/find-result', domainController.findResultDomain);
router.post('/change-result', domainController.changeResultDomain);
router.put('/delete-result/:id', domainController.deleteResultDomain);
router.post('/update-model', domainController.updateModelDomain);
router.post('/chat-box', domainController.chatBoxDomain);
router.post('/add-link', domainController.addLinkDomain);
router.post('/links', domainController.findLinksDomain);
router.post('/delete-link', domainController.deleteLinkDomain);
router.post('/add-material', upload.single('file'), domainController.addLearningMaterialDomain);
router.post('/materials', domainController.findLearningMaterialsDomain);
router.post('/read-material', domainController.readLearningMaterialDomain);
router.post('/delete-material', domainController.deleteLearningMaterialDomain);
router.delete('/:id', domainController.deleteDomain);
router.post('/modelId',domainController.modelIdDomain);

module.exports = router;