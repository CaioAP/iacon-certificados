const { MongoClient, ObjectId } = require('mongodb');
const mongoURL = 'mongodb://localhost:27017/';
const mongoOptions = { useUnifiedTopology: true };

exports.getAllMessages = (data, callback) => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    const query = { 
      companyId: parseInt(data.companyId),
      period: parseInt(data.period),
      documentPath: data.documentPath
    };
    const cursor = dbo.collection('documentos_messages').find(query);
    const messages = [];

    cursor.forEach(message => messages.push(message))
      .then(() => {
        callback(messages);
      })
      .catch( error => {
        console.error(error);
        callback(null, error);
      });
  });
}

exports.saveMessage = (data, callback) => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    dbo.collection('documentos_messages')
      .insertOne(data)
      .then(result => {
        console.log('result :>> ', result);
        db.close()
        callback();
      })
      .catch(err => {
        console.log('err :>> ', err);
        db.close();
        callback(err);
      });
  });
}