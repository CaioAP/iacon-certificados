const express = require('express');
const router = express.Router();

const certificate = require('../public/controllers/Certificate');

router.get('/', certificate.getCertificates);

router.get('/user/:id', certificate.getUserCertificates);

router.post('/insert', certificate.insert);

router.post('/validate', certificate.validate);

module.exports = router;
