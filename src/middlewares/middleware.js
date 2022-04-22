/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const colors = require('colors');
const { LoginModel } = require('../models/LoginModel');
const { ContatoModel } = require('../models/ContatoModel');

// Global middlewares, auth's every user
exports.middlewareGlobal = async (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.user;
  res.locals.contact = await ContatoModel.find();

  // If user exists
  if (res.locals.user !== undefined) {
    res.locals.user = await LoginModel.find({ _id: req.user._id }, (err, user) => {
      if (err) console.error(err);
      // Use it's id to populate idUser property
      Object.keys(user).forEach((key) => {
        res.locals.idUser = user[key]._id;
      });
    });
  }
  // If contact and user exists
  if (res.locals.contact !== undefined && res.locals.user !== undefined) {
    res.locals.contact = await ContatoModel.find({ createdBy: req.user._id }, (err, contact) => {
      if (err) console.error(err);
      // Use contact's createdBy index to match user's and populate idContact property
      Object.keys(contact).forEach((key) => {
        res.locals.idContact = contact[key].createdBy;
      });
    });
  }

  next();
};

// If it's not with CSRF token, return 404 page
exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render('404');
  }
  next();
};

// Use CSRF Token on every page
exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
