/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  // Logs in with user once there's an user and a hashed password
  async login() {
    await this.isValid();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email }).lean();

    if (!this.user) {
      this.errors.push('Usuário não cadastrado');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  // User's register must be valid and with hash
  async register() {
    await this.isValid();
    await this.compareEmails();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  // Validates email and phone number (only on 'pt-BR' format)
  async isValid() {
    await this.cleanUp();
    if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisar ter entre 3 e 50 caracteres');
    }
  }

  // Compare emails, if unique, returns an error
  async compareEmails() {
    const unique = await LoginModel.findOne({ email: this.body.email });
    if (unique) this.errors.push('Email já cadastrado!');
  }

  // Guarantees every key is a string
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = { Login, LoginModel };
