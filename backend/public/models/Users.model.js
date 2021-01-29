const mongoose = require("mongoose");
const md5 = require('md5');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

const UserModel = mongoose.model("documentos_sub_usuarios", UserSchema);

exports.checkExisting = async (filter) => {
  try {
    const query = { 
      $or: [
        { username: filter.username },
        { email: filter.email }
      ]
    };
    
    const result = await UserModel.findOne(query).exec();
  
    return result;
  } catch (error) {
    console.error(error);

    return error;
  }
}

exports.insert = async (data) => {
  try {
    const User = new UserModel({
      name: data.name.toUpperCase(),
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
      password: md5(data.password),
    });

    const result = await User.save();

    return result;
  } catch (error) {
    console.error(error);

    return null;
  }
}