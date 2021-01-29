const UsersModel = require("../models/Users.model");

exports.validate = (req, res, next) => {
  const data = req.body;
  const validate = [];

  if (!data.name) {
    validate.push('Nome inválido');
  }
  if (!data.email || data.email.indexOf('@') === -1) {
    validate.push('E-mail inválido');
  }
  if (!data.username || /[^a-zA-Z0-9@._-\s]/gm.test(data.username) === true) {
    validate.push('Nome de usuário inválido');
  }
  if (!data.password || data.password.length < 8) {
    validate.push('Senha inválida');
  }
  
  if (validate.length > 0) {
    validate.forEach(err => console.error(err));

    return res.status(400).send({
      success: false,
      message: validate
    });
  }
  else next();
}

exports.checkExisting = async (req, res, next) => {
  try {
    const result = await UsersModel.checkExisting(req.body);
    
    if (result) throw 'Usuário existente'
    else next();
  } catch (error) {
    console.error(error);

    return res.status(400).send({
      success: false,
      message: [error]
    });
  }
}

exports.insert = async (req, res, next) => {
  try {
    const result = await UsersModel.insert(req.body);

    if (!result) throw 'Erro ao cadastrar usuário'
    else return res.status(400).send({
      success: true,
      message: ['Usuário cadastrado com sucesso!']
    })
  } catch (error) {
    console.error(error);
    
    return res.status(400).send({
      success: false,
      message: [error]
    });
  }
}

exports.edit = (req, res, next) => {
  console.log(req.body);
}