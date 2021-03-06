const EmpresasModel = require('../models/Empresas.model');

exports.getEmpresas = async (req, res, next) => {
    try {
        let filter = '';
        if (req.query.companies)
            filter = req.query.companies.split(',');
        
        console.log(filter);

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