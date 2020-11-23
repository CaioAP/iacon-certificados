require('dotenv-safe').config();
const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const Busboy = require('busboy');
const jwt = require('jsonwebtoken');
const docsConfig = require('../config/Documents.config.json');
const { 
  formatPeriodMMAAAA,
  unformatPeriodAAAAMM
} = require('../utils/formats');
const { getCurrentDateTimeISOString } = require('../utils/dates');
const { 
  findDocsUserByUsername, 
  findDocsUserById 
} = require('../models/DocsUser.model');
const { 
  checkIfDocumentsFilesExists, 
  createDocumentsFiles,
  updateDocumentsFiles,
  loadDocumentFileInfo,
  findFilesByCompanyId,
  updateNoMovement
} = require('../models/Documents.model');

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
  formData.set('files', []);

  busboy.on('field', (fieldName, value) => {
    console.log(`:>> fieldName: ${fieldName} -> value: ${value}`);

    if (fieldName === 'period')
      value = unformatPeriodAAAAMM(value, '/');
    if (fieldName === 'companyId')
      value = parseInt(value);

    formData.set(fieldName, value);
  });

  busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
    const folderPath = path.join(
      docsConfig.path, 
      String(formData.get('companyId')), 
      formatPeriodMMAAAA(formData.get('period'), '-'), 
      formData.get('documentPath')
    );

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }

    const filePath = path.join(folderPath, fileName);
    file.pipe(fs.createWriteStream(filePath));

    const fileNameParts = fileName.split('.')
    const fileExt = fileNameParts[fileNameParts.length - 1]
    formData.get('files').push({
      fileName,
      fileExt,
      modified: getCurrentDateTimeISOString()
    })
  });

  busboy.on('finish', () => {
    console.log(':>> Finishing busboy');
    saveFileData(formData);

    res.status(200).send({ok: true});
  });

  console.log(':>> req.pipe(busboy)');
  return req.pipe(busboy);
}

const saveFileData = (formData) => {
  checkIfDocumentsFilesExists(formData, (result, err) => {
    if (err) throw err

    if (!result) createDocumentsFiles(formData);
    else {
      const files = formData.get('files');

      if ('files' in result) {
        result.files.forEach(r => {
          let contains = false;
          formData.get('files').forEach(f => {
            if (r.fileName === f.fileName) contains = true; 
          });
  
          if (!contains) files.push(r);
        });
      }
      formData.set('files', files);

      updateDocumentsFiles(formData);
    }
  });
}

exports.checkFileInfo = (req, res, next) => {
  const path = req.query.path;

  loadDocumentFileInfo(path, (result, error) => {
    console.log('result :>> ', result);
    if (error) return res.status(500).send({
      ok: false, 
      message: 'Erro ao tentar carregar o documento de informação!'
    });

    if (!result) return res.status(200).send({
      ok: false,
      message: 'Nenhum arquivo de informação existente!'
    });
    else return res.status(200).send({
      ok: true,
      message: 'Arquivo de informação carregado!',
      path: result.filepath,
      mimetype: result.mimetype
    })
  })
}

exports.loadFileInfo = (req, res, next) => {
  const path = req.query.path;
  const mimetype = req.query.mimetype;

  const file = fs.readFileSync(path);
  
  res.contentType(mimetype);
  return res.send(file);

  // loadDocumentFileInfo(path, (result, error) => {
  //   console.log('result :>> ', result);
  //   if (error) return res.status(500).send({
  //     ok: false, 
  //     message: 'Erro ao tentar carregar o documento de informação!'
  //   });

  //   const file = fs.readFileSync(result.filepath);
    
  //   res.contentType(result.mimetype);
  //   return res.send(file);
  // })
}

exports.getUserFiles = (req, res, next) => {
  const data = {
    companyIds: req.query.companyIds.split(',').map(id => parseInt(id)),
    period: unformatPeriodAAAAMM(String(req.query.period), '/')
  }

  findFilesByCompanyId(data, (result, err) => {
    if (err) return res.status(500).send({
      message: 'Erro ao tentar retornar os arquivos do usuário'
    });

    res.status(200).send({
      data: result,
      message: 'Arquivos do usuário carregados com sucesso!'
    });
  })
}

exports.setNoMovement = (req, res, next) => {
  const noMovement = !req.body.noMovement ? true : false
  const data = {
    noMovement,
    documentPath: req.body.documentPath,
    companyId: req.body.companyId,
    period: unformatPeriodAAAAMM(req.body.period, '/'),
    files: []
  }

  updateNoMovement(data, (result, err) => {
    if (err) return res.status(500).send({
      message: 'Erro ao tentar setar o documento como sem movimento'
    });

    res.status(200).send({
      data,
      result,
      message: 'Documento setado como sem movimento'
    })
  })
}