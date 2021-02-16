const express = require('express');
const router = express.Router();

const empresasController = require('../public/controllers/Empresas.controller');

router.get('/', empresasController.getEmpresas

    // MongoClient.connect(mongoURL, function(err, db) {
    //     if (err) throw err;

    //     const dbo = db.db('iacon');
    //     const query = {};
    //     dbo.collection('empresas').find(query).toArray(function(err, result) {
    //         if (err) throw err;
    //         db.close();
    //         res.send(result);
    //     });
    // })
);

router.get('/folders', function(req, res, next) {
    console.log('req.query :>> ', req.query);
    const query = { 
        companyId: {
            $in: req.query.companies.split(',').map(company => parseInt(company))
        }
    }
    console.log('query :>> ', query);
    
    // MongoClient.connect(mongoURL, function(err, db) {
    //     if (err) throw err;

    //     const dbo = db.db('iacon');
    //     dbo.collection('checkdocs').find(query).toArray(function(err, result) {
    //         if (err) throw err;
    //         db.close();
    //         res.send(result);
    //     });
    // })
});

module.exports = router;