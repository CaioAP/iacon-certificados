const Certificates = require('../models/Certificate');
const Users = require('../models/User');
const cmd = require('node-cmd');
const path = require('path');
const pem = require('pem');
const fs = require('fs');

const date = require('../utils/dates');

const TEMP_PATH = path.join(path.dirname(path.dirname(__dirname)), 'temp');
const UPLOAD_PATH = path.join(path.dirname(path.dirname(__dirname)), 'uploads');
const SCRIPTS_PATH = path.join(path.dirname(__dirname), 'scripts');

pem.config({
  pathOpenSSL: process.env.OPENSSL_PATH,
})

const insert = async (req, res, next) => {
  try {
    const files = req.files;
    const passwords = req.body.passwords.split(',');

    const exists = await checkExistingCertificates(files);
    if (exists) return res.status(400).send({
      message: `Já existem certificados com esses nomes: \n${exists.join('\n')}\n Favor alterar os nomes e enviar novamente!`
    });

    const filesData = await handleFiles(files, passwords, req.body.userId);
    console.log('filesData :>> ', filesData);
    await Certificates.insert(filesData);

    return res.status(200).send({
      message: 'Certificados inseridos com sucesso!' 
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: 'Dados inválidos!'
    });
  }
};

const checkExistingCertificates = async (files) => {
  const alreadyExists = [];
  const certificates = (await Certificates.getAll()).map(certificate => certificate.name);
  
  Object.entries(files).forEach(([key, certificate]) => {
    if (certificates.includes(certificate.name))
      alreadyExists.push(certificate.name);
  });

  return alreadyExists.length ? alreadyExists : false
}

const handleFiles = async (files, passwords, userId) => {
  let count = 0;
  const certificates = [];

  for (let key in files) {
    if (files.hasOwnProperty(key)) {
      const file = files[key];

      if (await saveCertificateFile(file, userId)) {
        certificates.push({
          userId,
          name: file.name,
          size: file.size,
          encoding: file.encoding,
          mimetype: file.mimetype,
          password: passwords[count],
          insertedAt: date.getCurrentDate(),
          expiration: await getCertificateExpiration(file, passwords[count], userId),
        });
      }

      count++;
    }
  }
  
  return certificates;
};

const saveCertificateFile = async (file, userId) => {
  const folderPath = path.join(UPLOAD_PATH, userId);
  const filePath = path.join(folderPath, file.name);

  checkUserFolderPath(folderPath);

  await new Promise((resolve, reject) => {
      file.mv(filePath, (error) => {
        if (error) reject(console.log(error));

        resolve();
      });
  });

  if (fs.existsSync(filePath)) return true;
  return false;
};

const checkUserFolderPath = (folderPath) => {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
};

const getCertificateExpiration = async (file, password, userId) => {
  const filePath = path.join(UPLOAD_PATH, userId, file.name);
  const execPath = path.join(SCRIPTS_PATH, 'get_certificate_file_data.py');
  const exec = `python ${execPath} "${filePath}" ${password}`;

  const certitificateData = await new Promise((resolve, reject) => {
    cmd.get(
      exec,
      (error, data, stdError) => {
        if (error) console.log(error);
        if (stdError) console.log(stdError);

        resolve(JSON.parse(data));
      }
    );
  });
  
  return new Date(new Date(certitificateData.fim_validade) - date.getTimeZoneOffset());
}

const validate = async (req, res, next) => {
  try {
    const file = req.files.certificate;
    const password = req.body.password;
    const filePath = path.join(TEMP_PATH, file.name);

    file.mv(filePath, function(err) {
      if (err)
        return console.log(err);

      const pfx = fs.readFileSync(filePath);
      pem.readPkcs12(pfx, { p12Password: password }, (err, cert) => {
        if (err) 
          return res.status(400).send({
            valid: false,
            message: 'Senha incorreta!'
          });

        res.status(200).send({
          valid: true,
          message: 'Senha válida para este certificado!'
        })
      });

      removeTempFile(filePath);
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      valid: false,
      message: 'Erro no servidor!'
    });
  }
};

const removeTempFile = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) return console.log(error);
    console.log('Removed :>> ', filePath);
  });
}

const getCertificates = async (req, res, next) => {
  try {
    const result = await Certificates.getAll();
    const users = await Users.getAllUsers();
    console.log(users);

    result.forEach(certificate => {
      certificate.userName = users.find(user => String(user._id) === certificate.userId).name;
    })

    res.status(200).send({ 
      certificates: cleanCertificatesData(result),
      message: 'Certificados retornados com sucesso!'
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: 'Erro na busca de certificados!'
    });
  }
};

const getUserCertificates = async (req, res, next) => {
  try {
    const result = await Certificates.getUserCertificates(req.params.id);
    
    res.status(200).send({
      certificates: cleanCertificatesData(result),
      message: 'Certificados retornados com sucesso!'
    });
  } catch (error) {
    res.status(400).send({
      message: 'Usuário inválido!'
    });
  }
};

const cleanCertificatesData = (certificates) => {
  return certificates.map(certificate => ({
    _id: String(certificate._id),
    name: certificate.name,
    size: certificate.size,
    userName: certificate.userName ? certificate.userName : null,
    insertedAt: certificate.insertedAt,
    expiration: certificate.expiration
  }));
};

module.exports = {
  insert,
  validate,
  getCertificates,
  getUserCertificates
};