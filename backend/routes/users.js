const express = require('express');
const router = express.Router();

const users = require('../public/controllers/User');

router.get('/:id', users.getUser);

router.post('/auth', users.authenticate);

router.post('/insert', [
  users.checkExisting,
  users.insertUser
]);

// router.post('/edit', userController.edit);

// router.get('/pesquisar', userController.pesquisar);

// router.get('/files', docsUserController.getUserFiles);

// router.post('/documents', [
//   docsUserController.handleFormData,
//   docsUserController.saveFileData,
//   docsUserController.createDocumentActivity
// ]);

// router.get('/checkinfo', docsUserController.checkFileInfo);

// router.get('/info', docsUserController.loadFileInfo);

// router.post('/no-movement', docsUserController.setNoMovement);

// router.get('/message', docsUserController.getMessages);

// router.post('/message', docsUserController.setMessage);

// router.post('/carregar-usuario-empresas', [
//   userController.carregarEmpresas,
//   // userController.validarEmpresas
// ]);

module.exports = router;
