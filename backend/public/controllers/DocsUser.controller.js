require('dotenv-safe').config();
const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const Busboy = require('busboy');
const jwt = require('jsonwebtoken');
const docsConfig = require('../config/Documents.config.json');
const { formatPeriodMMAAAA } = require('../utils/formats');
const { findDocsUserByUsername, findDocsUserById } = require('../models/DocsUser.model');

exports.authenticateUser = (req, res, next) => {
  findDocsUserByUsername(req.body.username, (userdata, err) => {
    if (err)
      return res.status(500).send({
        message: 'Erro ao tentar carregar o usuário pelo nome de usuário'
      });

    if (userdata && md5(req.body.password) === userdata.password) {
      const id = userdata._id;
      const token = jwt.sign({id}, process.env.SECRET, {
        expiresIn: 3600
      });

      return res.status(200).send({ token: token});
    }

    res.status(401).send({ message: 'Login inválido!' })
  });
}

exports.validateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({message: 'No token provided'});

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(401).send({message: 'Token outdated'});

    req.userId = decoded.id;
    next();
  })
}

exports.getUserData = (req, res, next) => {
  findDocsUserById(req.userId, (userdata, err) => {
    if (err) return res.status(500).send({
      message: 'Erro ao tentar retornar os dados do usuário'
    });

    res.status(200).send(userdata);
  })
}

exports.handleFormData = (req, res, next) => {
  const busboy = new Busboy({
    headers: req.headers
  });

  console.log(':>> Getting data from Request');
  const formData = new Map();
  formData.set('files', {});

  busboy.on('field', (fieldName, value) => {
    console.log(`:>> fieldName: ${fieldName} -> value: ${value}`);
    formData.set(fieldName, value);
  });

  busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
    const folderPath = path.join(
      docsConfig.path, 
      formData.get('companyId'), 
      formatPeriodMMAAAA(formData.get('period'), '-'), 
      formData.get('documentPath')
    );
    // TODO:

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }

    const filePath = path.join(folderPath, fileName);
    file.pipe(fs.createWriteStream(filePath));

    formData.get('files')[fileName] = filePath;
  });

  busboy.on('finish', () => {
    console.log(':>> Finishing busboy');

    saveFileData(formData);
    // console.log('formData :>> ', formData);

    res.status(200).send({ok: true});
  });

  console.log(':>> req.pipe(busboy)');
  return req.pipe(busboy);
}

const saveFileData = (formData) => {
  console.log('formData :>> ', formData);
}

