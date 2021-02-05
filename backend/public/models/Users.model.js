const mongoose = require("mongoose");
const md5 = require('md5');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  superId: { type: String, required: true },
  companies: { type: Array, default: () => new Array() },
  documents: { type: Object, default: () => new Object() }
});

const UserModel = mongoose.model("documentos_usuarios", UserSchema);

exports.checkExisting = async filter => {
  try {
    const query = { 
      $and: [
        { superId: filter.superId },
        { 
          $or: [
            { username: filter.username },
            { email: filter.email }
          ]
        }
      ]
    };
    
    const result = await UserModel.findOne(query).exec();
  
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.insert = async data => {
  try {
    const User = new UserModel({
      name: data.name.toUpperCase(),
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
      password: md5(data.password),
      superId: data.superId,
      companies: []
    });

    await User.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.filter = async filter => {
  try {
    const query = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        query[key] = { $regex: filter[key] };
      }
    }
    const select = { name: 1, email: 1, username: 1, _id: 1 };

    const result = await UserModel.find(query).select(select).exec();

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}