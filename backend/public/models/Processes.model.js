const { MongoClient, ObjectId } = require('mongodb');
const mongoURL = 'mongodb://localhost:27017/';
const mongoOptions = { useUnifiedTopology: true };
const log = require('debug')('iacon:Processes.model')

exports.getActivitiesByFolderPath = folderPath => {
    log(`    Consultando atividades para a pasta "${folderPath}"`);
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            const query = {
                folder_path: folderPath
            };

            const cursor = dbo.collection('processos_atividades').find(query);
            const activities = [];

            cursor.forEach(activity => activities.push(activity))
                .then(() => {
                    db.close();
                    resolve(activities);
                })
                .catch((error) => {
                    db.close();
                    console.error(error);
                    reject(null)
                });
        })
    });
}

exports.getResponsiblesByCompany = companyId => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            const query = { codigo: companyId };

            const cursor = dbo.collection('responsaveis_empresa').find(query);
            const responsibles = [];

            cursor.forEach(responsible => responsibles.push(responsible))
                .then(() => {
                    db.close();
                    resolve(responsibles)
                })
                .catch((error) => {
                    db.close();
                    console.error(error);
                    reject(null)
                });
        })
    });
}

exports.checkIfProcessExists = process => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            const query = {
                codigo: process.codigo,
                cod_rotina: process.cod_rotina,
                competencia: process.competencia,
                departamento: process.departamento,
                responsavel: process.responsavel
            };

            dbo.collection('processos_gerais')
                .findOne(query)
                .then(response => {
                    db.close();
                    resolve(response);
                })
                .catch(error => {
                    db.close();
                    console.error(error);
                    reject();
                })
        })
    })
}

exports.createActivities = process => {
    log('process :>> ', process);
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            dbo.collection('processos_gerais')
                .insertMany(process)
                .then(response => {
                    db.close();
                    resolve(response);
                })
                .catch(error => {
                    db.close();
                    console.error(error);
                    resolve(null);
                })
        });
    })
}

exports.updateProcessActivities = process => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            const query = {
                codigo: process.codigo,
                departamento: process.departamento,
                competencia: process.competencia,
                cod_rotina: process.cod_rotina,
                responsavel: process.responsavel
            };
            const update = {
                $addToSet: {
                    atividades: process.atividades
                }
            }

            dbo.collection('processos_gerais')
                .updateOne(query, update)
                .then(response => {
                    db.close();
                    resolve(response);
                })
                .catch(error => {
                    db.close();
                    console.error(error);
                    resolve(null);
                })
        });
    })
}

exports.getDepartmentName = department => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            const query = { id: department };

            dbo.collection('departamentos').findOne(query)
                .then(response => {
                    db.close();
                    resolve(response.nome);
                })
                .catch(error => {
                    db.close();
                    console.error(error);
                    reject(null);
                })
        });
    })
}

exports.getAllDepartments = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            const query = {};

            const cursor = dbo.collection('departamentos').find(query)
            const departments = [];

            cursor.forEach(department => departments.push(department))
                .then(() => {
                    db.close();
                    resolve(departments);
                })
                .catch(error => {
                    db.close();
                    console.error(error);
                    resolve(null);
                })
        });
    })
}

exports.getAllDepartmentResponsibles = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
            if (err) throw err;

            const dbo = db.db('iacon');
            // const query = { 'responsaveis.responsaveis.usuario': responsible };
            const departments = {};

            const cursor = dbo.collection('departamento_responsaveis').find({});

            cursor.forEach(department => {
                if (!(department.codigo in departments))
                    departments[department.codigo] = department
                else if (departments[department.codigo].vigencia < department.vigencia)
                    departments[department.codigo] = department
            }).then(() => {
                db.close();
                resolve(departments);
            }).catch(error => {
                console.error(error);
                db.close();
                resolve({});
            })
        });
    });
}