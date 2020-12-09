const { MongoClient, ObjectId } = require('mongodb');
const mongoURL = 'mongodb://localhost:27017/';
const mongoOptions = { useUnifiedTopology: true };

exports.checkIfDocumentsFilesExists = async (data, callback) => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    const query = {
      $and: [
        { companyId: data.get('companyId') },
        { period: data.get('period') },
        { documentPath: data.get('documentPath') }
      ]
    };

    dbo.collection('documentos_files')
      .findOne(query)
      .then(result => {
        db.close();
        callback(result);
      })
      .catch(err => {
        db.close();
        console.log('err :>> ', err);
        callback(null, err);
      });
  });
}

exports.createDocumentsFiles = data => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    dbo.collection('documentos_files')
      .insertOne(data)
      .then(result => db.close())
      .catch(err => {
        console.log('err :>> ', err);
        db.close();
      });
  });
}

exports.updateDocumentsFiles = data => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    const query = {
      $and: [
        { companyId: data.get('companyId') },
        { period: data.get('period') },
        { documentPath: data.get('documentPath') }
      ]
    };
    const update = {
      $set: {
        files: data.get('files')
      }
    }

    dbo.collection('documentos_files')
      .updateOne(query, update)
      .then(result => db.close())
      .catch(err => {
        console.log('err :>> ', err);
        db.close();
      });
  });
}

exports.loadDocumentFileInfo = (path, callback) => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    const query = { folder: path };

    dbo.collection('documentos_info')
      .findOne(query)
      .then(result => {
        db.close();
        callback(result);
      })
      .catch(err => {
        db.close();
        console.log('err :>> ', err);
        callback(null, err);
      });
  });
}

exports.findFilesByCompanyId = (data, callback) => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    const query = { 
      companyId: { $in: data.companyIds },
      period: data.period
    };
    const cursor = dbo.collection('documentos_files').find(query);
    const files = {};
    const noMovements = {};

    cursor.forEach(document => {
      if (!(document.companyId in files)) 
        files[document.companyId] = {};
      if (!(document.companyId in noMovements)) 
      noMovements[document.companyId] = {};

      files[document.companyId][document.documentPath] = [];
      noMovements[document.companyId][document.documentPath] = document.noMovement;

      if ('files' in document) {
        document.files.forEach(file => {
          files[document.companyId][document.documentPath].push(file.fileName)
        });
      }
    }).then(() => {
      callback({files, noMovements});
    })
    .catch( error => {
      console.error(error);
      callback(null, error);
    });
  });
}

exports.updateNoMovement = (data, callback) => {
  MongoClient.connect( mongoURL, mongoOptions, (err, db) => {
    if (err) throw err;

    const dbo = db.db('iacon');
    const query = {
      $and: [
        { companyId: data.companyId },
        { period: data.period },
        { documentPath: data.documentPath }
      ]
    };
    const update = {
      $set: {
        noMovement: data.noMovement
      }
    }
    const options = { upsert: true };

    dbo.collection('documentos_files')
      .updateOne(query, update, options)
      .then( result => {
        callback(result);
        db.close();
      })
      .catch( err => {
        console.error(err);
        callback(null, err);
        db.close();
      });
  });
}