const { MongoClient, ObjectId } = require('mongodb');
const mongoURL = 'mongodb://localhost:27017/';
const mongoOptions = { useUnifiedTopology: true };

exports.findDocsUserByUsername = async(username, callback) => {
    MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
        if (err) throw err;

        const dbo = db.db('iacon');
        const query = { username: username };

        dbo.collection('documentos_usuarios')
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

exports.findDocsUserById = async(id, callback) => {
    MongoClient.connect(mongoURL, mongoOptions,
        (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            const query = { _id: ObjectId(id) };
            const projection = { projection: { password: false, __v: false } };

            dbo.bios
            dbo.collection('documentos_usuarios')
                .findOne(query, projection)
                .then(result => {
                    db.close();
                    callback(result);
                })
                .catch(err => {
                    db.close();
                    console.log('err :>> ', err)
                    callback(null, err);
                });
        }
    );
}