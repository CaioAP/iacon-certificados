const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CertificateSchema = new Schema({
  userId: { type: String, trim: true, required: true },
  name: { type: String, trim: true, required: true, unique: true },
  size: { type: Number, required: true },
  encoding: { type: String, required: true },
  mimetype: { type: String, required: true },
  password: { type: String, required: true },
  insertedAt: { type: Date, required: true },
  expiration: { type: Date, required: true }
});

const CertificateModel = mongoose.model('clientes_certificados', CertificateSchema);

const insert = async (certificates) => {
  try {
    return await CertificateModel.insertMany(certificates);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getAll = async () => {
  try {
    const query = {};

    return await CertificateModel.find(query).exec();
  } catch (error) {
    console.log(error);
    throw error
  }
}

const getUserCertificates = async (userId) => {
  try {
    const query = {
      userId: ObjectId(userId)
    };
    const select = {
      user: true,
      name: true,
      size: true,
      insertedAt: true,
      expiration: true
    }

    return await CertificateModel.find(query).select(select).exec();
  } catch (error) {
    console.log(error);
    throw error
  }
}

module.exports = {
  insert,
  getAll,
  getUserCertificates
}