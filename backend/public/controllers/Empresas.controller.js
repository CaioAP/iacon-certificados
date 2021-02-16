const EmpresasModel = require('../models/Empresas.model');

exports.getEmpresas = async (req, res, next) => {
    try {
        console.error.log(req.query);
        console.error.log(req.params);

        const empresas = await EmpresasModel.filter([]);

        return res.status(200).send({
            success: false,
            message: ['Empresas carregadas com sucesso!'],
            data: empresas
        })
    } catch (error) {
        console.error(error);
    }
}