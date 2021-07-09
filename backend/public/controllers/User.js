const md5 = require('md5');
const jwt = require('jsonwebtoken');
const Users = require('../models/User');

const passwordMatch = (passwordString, password) => {
  return md5(passwordString) === password;
}

const authenticate = async (req, res, next) => {
  try {
    const user = await Users.findUser(req.body.username);

    if (user && passwordMatch(req.body.password, user.password)) {
      const id = user._id;
      const token = jwt.sign({ id }, process.env.SECRET);

      return res.status(200).send({ token: token, id: id });
    }

    res.status(401).send({ message: 'Usuário ou senha inválidos!' })
  } catch (error) {
    return res.status(404).send({
      message: 'Usuário não existe!',
      error: error
    });
  }
};

const insertUser = async (req, res, next) => {
  try {
    const result = await Users.insert(req.body);

    if (result) {
      return res.status(200).send({
        message: 'Cliente inserido com sucesso!' 
      })
    }
  } catch (error) {
    res.status(400).send({
      message: 'Dados inválidos!'
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const result = await Users.getUser(req.params.id);

    res.status(200).send({ 
      ...result._doc,
      message: 'Usuário retornado com sucesso!'
    });
  } catch (error) {
    res.status(404).send({
      message: 'Usuário inexistente!'
    });
  }
};

const checkExisting = async (req, res, next) => {
  try {
    const username = req.body?.email ? req.body.email : req.body?.cnpj;
    req.user = await Users.findUser(username);
    
    if (req.user) throw 'Usuário existente';

    next();
  } catch (error) {
    return res.status(400).send({
      message: error
    });
  }
}

module.exports = {
  authenticate,
  insertUser,
  getUser,
  checkExisting
}

// exports.validate = (req, res, next) => {
//   const data = req.body;
//   const validate = [];

//   if (!data.name) {
//     validate.push('Nome inválido');
//   }
//   if (!data.email || data.email.indexOf('@') === -1) {
//     validate.push('E-mail inválido');
//   }
//   if (!data.username || /[^a-zA-Z0-9@._-\s]/gm.test(data.username) === true) {
//     validate.push('Nome de usuário inválido');
//   }
//   if (!data.password || data.password.length < 8) {
//     validate.push('Senha inválida');
//   }
  
//   if (validate.length > 0) {
//     validate.forEach(err => console.error(err));

//     return res.status(400).send({
//       success: false,
//       message: validate
//     });
//   }
//   else next();
// }


// exports.insert = async (req, res, next) => {
//   try {
//     await UsersModel.insert(req.body);

//     return res.status(200).send({
//       success: true,
//       message: ['Usuário cadastrado com sucesso!']
//     })
//   } catch (error) {
//     console.error(error);
    
//     return res.status(400).send({
//       success: false,
//       message: [error]
//     });
//   }
// }

// exports.edit = (req, res, next) => {
//   console.log(req.body);
// }

// exports.pesquisar = async (req, res, next) => {
//   try {
//     const filter = req.query;

//     const result = await UsersModel.filter(filter);
//     console.log('result :>> ', result);

//     return res.status(200).send({
//       success: true,
//       message: ['Usuários retornados com sucesso!'],
//       data: result
//     })
//   } catch (error) {
//     console.error(error);

//     return res.status(400).send({
//       success: false,
//       message: [error]
//     })
//   }
// }

// exports.carregarEmpresas = async (req, res, next) => {
//   try {
//     const usuarios = await UsersModel.filter({_id: ObjectId(this.query.id)});
//     const usuario = usuarios[0];

//   } catch (error) {
//     console.error(error);

//     return res.status(400).send({
//       success: false,
//       message: [error]
//     })
//   }
// }

// exports.handleFormData = (req, res, next) => {
//     const busboy = new Busboy({
//         headers: req.headers
//     });

//     log(' Getting data from Request');
//     const formData = new Map();
//     formData.set('files', []);

//     busboy.on('field', (fieldName, value) => {
//         log(`     fieldName: ${fieldName} -> value: ${value}`);

//         if (fieldName === 'period')
//             value = unformatPeriodAAAAMM(value, '/');
//         if (fieldName === 'companyId')
//             value = parseInt(value);

//         formData.set(fieldName, value);
//     });

//     busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
//         const folderPath = path.join(
//             docsConfig.path,
//             String(formData.get('companyId')),
//             formatPeriodMMAAAA(formData.get('period'), '-'),
//             formData.get('documentPath')
//         );

//         if (!fs.existsSync(folderPath)) {
//             fs.mkdirSync(folderPath, { recursive: true });
//         }

//         let filePath = path.join(folderPath, fileName);
//         let original_name = fileName;
//         console.log(filePath);
//         let counter = 0;
//         while (fs.existsSync(filePath)) {
//             counter += 1;
//             let parts = original_name.split('.');
//             let ext = parts.pop();
//             let basename = parts.join('.');
//             fileName = `${basename} ${counter}.${ext}`;
//             filePath = path.join(folderPath, fileName);
//         }
//         log(`Gravando arquivo em:`);
//         log(`    ${filePath}`);
//         file.pipe(fs.createWriteStream(filePath));

//         const fileNameParts = fileName.split('.')
//         const fileExt = fileNameParts[fileNameParts.length - 1]
//         formData.get('files').push({
//             fileName,
//             fileExt,
//             modified: getCurrentDateTimeISOString()
//         })
//     });

//     busboy.on('finish', () => {
//         log('Finishing busboy');
//         req.body.formData = formData;
//         // saveFileData(formData);
//         // createDocumentActivity(formData);

//         res.status(200).send({ ok: true });
//         next();
//     });

//     return req.pipe(busboy);
// }

// exports.saveFileData = (req, res, next) => {
//     log('Salvando arquivos enviados')
//     const formData = req.body.formData;

//     checkIfDocumentsFilesExists(formData, (result, err) => {
//         log('Verificando se já existem arquivos')
//         if (err) throw err

//         if (!result) {
//             log('    Nenhum arquivo. Criar todos')
//             createDocumentsFiles(formData);
//         } else {
//             log('    Arquivos pré existentes. Atualizar lista')
//             const files = formData.get('files');

//             if ('files' in result) {
//                 result.files.forEach(r => {
//                     let contains = false;
//                     formData.get('files').forEach(f => {
//                         if (r.fileName === f.fileName) contains = true;
//                     });

//                     if (!contains) files.push(r);
//                 });
//             }
//             formData.set('files', files);

//             updateDocumentsFiles(formData);
//         }
//         next();
//     });
// }