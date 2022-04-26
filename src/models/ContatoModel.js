/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  surname: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true },
  // Relates with LoginModel and uses user's id to fill the index
  createdBy: {
    type: mongoose.ObjectId,
    ref: 'Login',
  },
});
const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body, id) {
    this.id = id;
    this.body = body;
    this.errors = [];
    this.contact = null;
  }

  // Creates contacts once it's valid
  async createContact() {
    await this.isValid();
    if (this.errors.length > 0) return;

    this.contact = await ContatoModel.create(this.body);
  }

  // Validates email and phone number (only on 'pt-BR' format)
  async isValid() {
    await this.cleanUp();
    if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido!');
    if (!validator.isMobilePhone(this.body.tel, ['pt-BR'])) this.errors.push('Numero de telefone inválido');
  }

  // Guarantees every key is a string
  async cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      createdBy: this.id,
      firstname: this.body.firstname,
      surname: this.body.surname,
      tel: this.body.tel,
      email: this.body.email,
    };
  }
}

Contato.prototype.edit = async function (id) {
  if (typeof id !== 'string') return;
  await this.isValid();
  if (this.errors.length > 0) return;
  this.contact = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

Contato.delete = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id });
  return contato;
};

Contato.buscaPorId = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
};

module.exports = { Contato, ContatoModel };
