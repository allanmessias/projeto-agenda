/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const { Contato } = require('../models/ContatoModel');
const { LoginModel } = require('../models/LoginModel');

// Only shows if there's an user logged in
exports.index = async (req, res) => {
  if (res.locals.idUser !== undefined) {
    await res.render('contato', {
      contacts: {},
    });
    return;
  }
  req.flash('errors', 'Você precisa estar logado para acessar essa página');
  res.redirect('/');
};

// Register contact using the request body and user id
exports.register = async (req, res, next) => {
  try {
    const id = req.user._id;
    const contacts = new Contato(req.body, id);
    await contacts.createContact();

    if (contacts.errors.length > 0) {
      req.flash('errors', contacts.errors);
      res.redirect(`/user/${req.user._id}/contato/index`);
      return;
    }

    req.flash('success', 'Contato salvo com sucesso');

    // Lookup on LoginModel and populate createdBy index with logged in user's id
    await LoginModel.find().populate('createdBy');

    req.session.contact = contacts.contact;
    req.session.save(() => res.redirect(`/user/${req.user._id}/contato/index`));
    return;
  } catch (e) {
    console.log(e);
    res.render('404');
  }
  next();
};

exports.editIndex = async (req, res, next) => {
  if (!req.params.id) { return res.render('404'); }

  const contacts = await Contato.buscaPorId(req.params.id);
  if (!contacts) { return res.render('404'); }

  res.render('contato', { contacts });
  next();
};

exports.edit = async (req, res, next) => {
  try {
    if (!req.params) return res.render('404');
    const id = req.user._id;
    const contacts = new Contato(req.body, id);
    await contacts.edit(req.params.idcontact);

    if (contacts.errors.length > 0) {
      req.flash('errors', contacts.errors);
      res.redirect(`/user/${req.user._id}/contato/index`);
      return;
    }

    req.flash('success', 'Contato editado com sucesso');

    // Lookup on LoginModel and populate createdBy index with logged in user's id
    await LoginModel.find().populate('createdBy');

    req.session.contact = contacts.contact;
    req.session.save(() => res.redirect(`/user/${req.user._id}/contato/index`));
    return;
  } catch (e) {
    res.render('404');
  }
  next();
};

exports.delete = async (req, res, next) => {
  try {
    if (!req.params) return res.render('404');
    const contacts = await Contato.delete(req.params.idcontact);
    req.flash('success', 'contato deletado com sucesso');
    req.session.save(() => res.redirect(`/user/${req.user._id}/contato/index`));
    return contacts;
  } catch (e) {
    res.render('404');
  }
  next();
};
