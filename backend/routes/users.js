const express = require('express');
const router = express.Router();

const docsUserController = require('../public/controllers/DocsUser.controller');
const userController = require('../public/controllers/User.controller');

router.get('/', docsUserController.validateUser, docsUserController.getUserData);

router.post('/auth', docsUserController.authenticateUser);

router.post('/insert', [
  userController.validate,
  userController.checkExisting,
  userController.insert
]);

router.post('/edit', userController.edit);

router.get('/pesquisar', userController.pesquisar);

router.get('/files', docsUserController.getUserFiles);

router.post('/documents', [
  docsUserController.handleFormData,
  docsUserController.saveFileData,
  docsUserController.createDocumentActivity
]);

router.get('/checkinfo', docsUserController.checkFileInfo);

router.get('/info', docsUserController.loadFileInfo);

router.post('/no-movement', docsUserController.setNoMovement);

router.get('/message', docsUserController.getMessages);

router.post('/message', docsUserController.setMessage);

module.exports = router;
