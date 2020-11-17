const express = require('express');
const router = express.Router();

const docsUserController = require('../public/controllers/DocsUser.controller');

router.get('/', docsUserController.validateUser, docsUserController.getUserData);

router.post('/auth', docsUserController.authenticateUser);

router.post('/documents', docsUserController.handleFormData);

router.get('/info', docsUserController.loadFileInfo);

module.exports = router;
