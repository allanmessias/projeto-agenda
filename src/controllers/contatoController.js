/* eslint-disable no-underscore-dangle */
const { Contato } = require('../models/ContatoModel');
const { LoginModel } = require('../models/LoginModel');

// Only shows if there's an user logged in
exports.index = (req, res) => {
  if (res.locals.idUser !== undefined) {
    res.render('contato');
    return;
  }
  req.flash('errors', 'Você precisa estar logado para acessar essa página');
  res.redirect('/');
};

// Register contact using the request body and user id
exports.register = async (req, res) => {
  try {
    const id = req.user._id;
    const contato = new Contato(req.body, id);
    await contato.createContact();

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      res.redirect(`/user/${req.user._id}/contato/index`);
      return;
    }

    req.flash('success', 'Contato salvo com sucesso');

    // Lookup on LoginModel and populate createdBy index with logged in user's id
    await LoginModel.find().populate('createdBy');

    req.session.contact = contato.contact;
    req.session.save(() => res.redirect(`/user/${req.user._id}/contato/index`));
    return;
  } catch (e) {
    console.log(e);
    res.render('404');
  }
};
