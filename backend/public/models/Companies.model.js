const { MongoClient, ObjectId } = require('mongodb');
const mongoURL = 'mongodb://localhost:27017/';
const mongoOptions = { useUnifiedTopology: true };

exports.getCompanyByCodigo = companyId => {
  return new Promise((resolve, reject) => {
    MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
      if (err) throw err;
      
      const dbo = db.db('iacon');
      const query = { codigo: companyId };

      dbo.collection('empresas').findOne(query)
        .then( response => {
          db.close();
          resolve(response);
        })
        .catch( error => {
          db.close();
          console.error(error);
          reject(null);
        })
    });
  })
}