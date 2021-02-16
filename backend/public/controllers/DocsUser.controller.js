require('dotenv-safe').config();
const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const Busboy = require('busboy');
const jwt = require('jsonwebtoken');
const log = require("debug")("iacon:DocsUser.controller");
const docsConfig = require('../config/Documents.config.json');
const {
    formatPeriodMMAAAA,
    unformatPeriodAAAAMM
} = require('../utils/formats');
const { getCurrentDateTimeISOString } = require('../utils/dates');
const {
    findDocsUserByUsername,
    findDocsUserById
} = require('../models/DocsUser.model');
const {
    checkIfDocumentsFilesExists,
    createDocumentsFiles,
    updateDocumentsFiles,
    loadDocumentFileInfo,
    findFilesByCompanyId,
    updateNoMovement
} = require('../models/Documents.model');

const {
    getActivitiesByFolderPath,
    createActivities,
    getResponsiblesByCompany,
    checkIfProcessExists,
    getAllDepartments,
    updateProcessActivities,
    getAllDepartmentResponsibles
} = require('../models/Processes.model');

const {
    getCompanyByCodigo
} = require('../models/Companies.model');

const { saveMessage, getAllMessages } = require('../models/Messages.model');

exports.authenticateUser = (req, res, next) => {
    findDocsUserByUsername(req.body.username, (userdata, err) => {
        if (err)
            return res.status(500).send({
                message: 'Erro ao tentar carregar o usuário pelo nome de usuário'
            });

        console.log(userdata);
        console.log(`req.body.password = ${req.body.password}`);
        console.log(`userdata.password = ${userdata.password}`);
        if (userdata && md5(req.body.password) === userdata.password) {
            const id = userdata._id;
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 3600
            });

            return res.status(200).send({ token: token });
        }

        res.status(401).send({ message: 'Login inválido!' })
    });
}

exports.validateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ message: 'No token provided' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Token outdated' });

        req.userId = decoded.id;
        next();
    })
}

exports.getUserData = (req, res, next) => {
    findDocsUserById(req.userId, (userdata, err) => {
        if (err) return res.status(500).send({
            message: 'Erro ao tentar retornar os dados do usuário'
        });

        res.status(200).send(userdata);
    })
}

exports.handleFormData = (req, res, next) => {
    const busboy = new Busboy({
        headers: req.headers
    });

    log(' Getting data from Request');
    const formData = new Map();
    formData.set('files', []);

    busboy.on('field', (fieldName, value) => {
        log(`     fieldName: ${fieldName} -> value: ${value}`);

        if (fieldName === 'period')
            value = unformatPeriodAAAAMM(value, '/');
        if (fieldName === 'companyId')
            value = parseInt(value);

        formData.set(fieldName, value);
    });

    busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
        const folderPath = path.join(
            docsConfig.path,
            String(formData.get('companyId')),
            formatPeriodMMAAAA(formData.get('period'), '-'),
            formData.get('documentPath')
        );

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, fileName);
        file.pipe(fs.createWriteStream(filePath));

        const fileNameParts = fileName.split('.')
        const fileExt = fileNameParts[fileNameParts.length - 1]
        formData.get('files').push({
            fileName,
            fileExt,
            modified: getCurrentDateTimeISOString()
        })
    });

    busboy.on('finish', () => {
        log('Finishing busboy');
        req.body.formData = formData;
        // saveFileData(formData);
        // createDocumentActivity(formData);

        res.status(200).send({ ok: true });
        next();
    });

    return req.pipe(busboy);
}

exports.saveFileData = (req, res, next) => {
    log("Salvando arquivos enviados")
    const formData = req.body.formData;

    checkIfDocumentsFilesExists(formData, (result, err) => {
        log("Verificando se já existem arquivos")
        if (err) throw err

        if (!result) {
            log("    Nenhum arquivo. Criar todos")
            createDocumentsFiles(formData);
        }
        else {
            log("    Arquivos pré existentes. Atualizar lista")
            const files = formData.get('files');

            if ('files' in result) {
                result.files.forEach(r => {
                    let contains = false;
                    formData.get('files').forEach(f => {
                        if (r.fileName === f.fileName) contains = true;
                    });

                    if (!contains) files.push(r);
                });
            }
            formData.set('files', files);

            updateDocumentsFiles(formData);
        }
        next();
    });
}

const findResponsibleInDepartment = (responsibles, respUser, respFound = false) => {
    responsibles.forEach(resp => {
        if (respUser.toUpperCase() === resp.usuario)
            respFound = true;
        else if ('responsaveis' in resp)
            respFound = findResponsibleInDepartment(resp.responsaveis, resp.usuario, respFound);
    });

    return respFound
}

exports.createDocumentActivity = async (req, res, next) => {
    const formData = req.body.formData;
    const companyId = formData.get('companyId');
    const companyData = await getCompanyByCodigo(companyId);
    const departments = await getAllDepartments();

    if (!companyData) return console.error('Nenhuma empresa encontrada!');

    const responsibles = await getResponsiblesByCompany(companyId);
    if (!responsibles) return console.error('Erro ao tentar carregar os responsáveis a serem criados');
    if (!responsibles.length) return log('Nenhum responsável a ser criado encontrado!');

    const departmentResponsibles = await getAllDepartmentResponsibles();

    const activities = await getActivitiesByFolderPath(formData.get('documentPath'));
    if (!activities) return console.error('Erro ao tentar carregar as atividades a serem criadas');
    if (!activities.length) return log('Nenhuma atividade a ser criada encontrada!');

    const newProcesses = [];

    activities.forEach((activity, idx) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 30);
        const vencimento = parseInt(currentDate.toISOString().split('T')[0].split('-').join(''));

        const newActivity = {
            idx,
            status: 0,
            atividade: activity.codigo,
            nome: activity.descricao,
            vencimento: vencimento,
            entrega: null,
            meta: vencimento,
            comentario: '',
            observacao: '',
            arquivo: false,
            document: true,
            files: []
        }

        let newResponsibles = responsibles.filter(resp => resp.departamento === activity.departamento);
        const maxDate = newResponsibles.map(resp => resp.date).reduce((resp1, resp2) => Math.max(resp1, resp2));
        newResponsibles = newResponsibles.filter(resp => resp.date === maxDate);

        newResponsibles.forEach(responsible => {
            const department = departmentResponsibles[responsible.departamento];
            const processIdx = newProcesses.findIndex(process => process.responsavel === responsible.responsavel);

            if (findResponsibleInDepartment(department.responsaveis, responsible.responsavel)) {
                if (processIdx == -1) {
                    newProcesses.push({
                        codigo: companyId,
                        empresa: companyData.nome,
                        cnpj: companyData.cnpj,
                        competencia: formData.get('period'),
                        cod_rotina: '000',
                        rotina: 'DOCUMENTO DO CLIENTE',
                        departamento: departments.find(dept => dept.id === activity.departamento).nome,
                        resp_dpto: responsible.resp_dpto,
                        resp_dpto_cod: responsible.resp_dpto_cod,
                        resp_dpto_nome: responsible.resp_dpto_nome,
                        responsavel: responsible.responsavel,
                        responsavel_cod: responsible.responsavel_cod,
                        responsavel_nome: responsible.responsavel_nome,
                        acesso: "0",
                        atividades: [newActivity]
                    });
                } else {
                    newProcesses[processIdx].atividades.push(newActivity);
                }
            } else {
                if (processIdx == -1) {
                    newProcesses.push({
                        codigo: companyId,
                        empresa: companyData.nome,
                        cnpj: companyData.cnpj,
                        competencia: formData.get('period'),
                        cod_rotina: '000',
                        rotina: 'DOCUMENTO DO CLIENTE',
                        departamento: departments.find(dept => dept.id === activity.departamento).nome,
                        resp_dpto: 'SEM.RESPONSAVEL',
                        resp_dpto_cod: 0,
                        resp_dpto_nome: 'SEM RESPONSÁVEL',
                        responsavel: 'SEM.RESPONSAVEL',
                        responsavel_cod: 0,
                        responsavel_nome: 'SEM RESPONSÁVEL',
                        acesso: "0",
                        atividades: [newActivity]
                    });
                } else {
                    newProcesses[processIdx].atividades.push(newActivity);
                }
            }
        });
    });

    const processExists = await checkIfProcessExists(newProcesses);

    let result;
    if (!processExists) {
        result = await createActivities(newProcesses);
        log('Processo criado com a lista de atividades');
    } else {
        result = await updateProcessActivities(newProcesses);
        log('Atividades inseridas no processo');
    }
}

exports.checkFileInfo = (req, res, next) => {
    const path = req.query.path;

    loadDocumentFileInfo(path, (result, error) => {
        if (error) return res.status(500).send({
            ok: false,
            message: 'Erro ao tentar carregar o documento de informação!'
        });

        if (!result) return res.status(200).send({
            ok: false,
            message: 'Nenhum arquivo de informação existente!'
        });
        else return res.status(200).send({
            ok: true,
            message: 'Arquivo de informação carregado!',
            path: result.filepath,
            mimetype: result.mimetype
        })
    })
}

exports.loadFileInfo = (req, res, next) => {
    const path = req.query.path;
    const mimetype = req.query.mimetype;

    const file = fs.readFileSync(path);

    res.contentType(mimetype);
    return res.send(file);
}

exports.getUserFiles = (req, res, next) => {
    const data = {
        companyIds: req.query.companyIds.split(',').map(id => parseInt(id)),
        period: unformatPeriodAAAAMM(String(req.query.period), '/')
    }

    findFilesByCompanyId(data, (result, err) => {
        if (err) return res.status(500).send({
            message: 'Erro ao tentar retornar os arquivos do usuário'
        });

        res.status(200).send({
            data: result,
            message: 'Arquivos do usuário carregados com sucesso!'
        });
    })
}

exports.setNoMovement = (req, res, next) => {
    const noMovement = !req.body.noMovement ? true : false
    const data = {
        noMovement,
        documentPath: req.body.documentPath,
        companyId: req.body.companyId,
        period: unformatPeriodAAAAMM(req.body.period, '/'),
        files: []
    }

    updateNoMovement(data, (result, err) => {
        if (err) return res.status(500).send({
            message: 'Erro ao tentar setar o documento como sem movimento'
        });

        res.status(200).send({
            data,
            result,
            message: 'Documento setado como sem movimento'
        })
    })
}

exports.getMessages = (req, res, next) => {
    const data = {
        companyId: parseInt(req.query.companyId),
        period: parseInt(req.query.period),
        documentPath: req.query.documentPath
    }

    getAllMessages(data, (result, err) => {
        if (err) return res.status(500).send({
            ok: false,
            message: 'Erro ao tentar carregar as mensagens'
        });

        res.status(200).send({
            ok: true,
            result,
            message: 'Mensagens retornadas com sucesso!'
        })
    })
}

exports.setMessage = (req, res, next) => {
    const data = {
        companyId: req.body.companyId,
        documentPath: req.body.documentPath,
        period: parseInt(req.body.period),
        username: req.body.username,
        fullname: req.body.fullname,
        text: req.body.text,
        datetime: req.body.datetime,
        usertype: req.body.usertype,
        notification: true
    }

    saveMessage(data, (err) => {
        if (err) return res.status(500).send({
            ok: false,
            message: 'Erro ao tentar salvar a mensagem'
        });

        res.status(200).send({
            ok: true,
            message: 'Mensagem salva com sucesso!'
        })
    })
}