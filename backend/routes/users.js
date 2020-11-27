const express = require('express');
const router = express.Router();

const docsUserController = require('../public/controllers/DocsUser.controller');

router.get('/', docsUserController.validateUser, docsUserController.getUserData);

router.post('/auth', docsUserController.authenticateUser);

router.get('/files', docsUserController.getUserFiles);

router.post('/documents', docsUserController.handleFormData);

router.get('/checkinfo', docsUserController.checkFileInfo);

router.get('/info', docsUserController.loadFileInfo);

router.post('/no-movement', docsUserController.setNoMovement);

router.get('/message', docsUserController.getMessages);

router.post('/message', docsUserController.setMessage);

module.exports = router;
