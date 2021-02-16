const mongoose = require("mongoose");
const md5 = require('md5');

const Schema = mongoose.Schema;
const EmpresaSchema = new Schema({
  cnpj: { type: String, required: true },
  codigo: { type: Number, required: true },
  cnae: { type: String, default: '' },
  cnae_cod: { type: String, default: '' },
  email: { type: String, default: '' },
  fone: { type: String, default: '' },
  grupo: { type: String, default: '' },
  grupo_cod: { type: String, default: '' },
  ie: { type: String, default: '' },
  im: { type: String, default: '' },
  inicio: { type: String, default: '' },
  mun: { type: String, default: '' },
  nome: { type: String, required: true },
  obs: { type: String, default: '' },
  regime_cod: { type: String, default: '' },
  saida: { type: String, default: null },
  simples: { type: String, default: '' },
  situacao: { type: String, default: 'A' },
  uf: { type: String, required: true },
  vigencia: { type: Object, default: new Object() }
});

const EmpresasModel = mongoose.model("empresas", EmpresaSchema);

exports.filterById = async companies => {
  try {
    const query = {

    };

    const result = await EmpresasModel.find(query).exec();

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}