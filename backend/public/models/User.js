const md5 = require('md5');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: { type: String, uppercase: true, trim: true, required: true },
  email: { type: String, lowercase: true, trim: true, required: true, unique: true },
  password: { type: String, required: true },
  cnpj: { type: String, minLength: 14, maxLength: 14, required: true, unique: true }
});

const UserModel = mongoose.model('usuarios_clientes', UserSchema);

const insert = async (user) => {
  try {
    const User = new UserModel({
      name: user.name,
      email: user.email,
      password: md5(user.password),
      cnpj: user.cnpj,
    });

    return await User.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const findUser = async (username) => {
  try {
    const query = {
      $or: [
        {
          email: username
        }, 
        {
          cnpj: username
        }
      ]
    };

    return await UserModel.findOne(query).exec();
  } catch (error) {
    console.log(error);
    throw error
  }
}

const getUser = async (userId) => {
  try {
    const query = {
      _id: ObjectId(userId)
    };
    const select = {
      name: true,
      email: true,
      cnpj: true
    };

    return await UserModel.findOne(query).select(select).exec();
  } catch (error) {
    console.log(error);
    throw error
  }
}

const getAllUsers = async () => {
  try {
    const query = {};
    const select = {
      name: true,
      email: true,
      cnpj: true
    };

    return await UserModel.find(query).select(select).exec();
  } catch (error) {
    console.log(error);
    throw error
  }
}

module.exports = {
  insert,
  findUser,
  getUser,
  getAllUsers
}