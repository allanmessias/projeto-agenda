/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const passport = require('passport');
const { Login } = require('../models/LoginModel');

exports.index = (req, res) => {
  res.render('login');
};

// Logs in if there's no errors
exports.loginErrors = async (req, res, next) => {
  const login = new Login(req.body);
  await login.login();

  if (login.errors.length > 0) {
    req.flash('errors', login.errors);
    res.redirect('/login/index');
    return;
  }

  next();
};

// User's authentication with passport
exports.passportAuthenticate = async (req, res, next) => {
  // Extract user's name until @ character
  const userEmailSlice = String(req.body.email).split('@')[0];
  await passport.authenticate('local', {
    successRedirect: `/user/${userEmailSlice}`,
    failureRedirect: '/',
    failureFlash: true,
  })(req, res, next);
};

// User's logout with passport, removing req.user property and clearing login session
exports.logout = async (req, res) => {
  if (res.locals.idUser) {
    await req.logout();
    req.flash('success', 'Você está deslogado');
    res.redirect('/login/index');
    return;
  }
  res.render('404');
};
