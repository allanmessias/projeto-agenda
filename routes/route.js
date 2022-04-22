const express = require('express');

const route = express.Router();
const homeController = require('../src/controllers/homeController');
const registerController = require('../src/controllers/registerController');
const loginController = require('../src/controllers/loginController');
const contatoController = require('../src/controllers/contatoController');
const userController = require('../src/controllers/userController');

// Home routes
route.get('/', homeController.index);

// User router
route.get('/user/:id?', userController.index);

// Register routes
route.get('/register/index', registerController.index);
route.post('/register/register', registerController.register);

// Login routes
route.get('/login/index', loginController.index);
route.post('/login', loginController.loginErrors, loginController.passportAuthenticate);

// Logout route
route.get('/user/:id/logout', loginController.logout);

// Contact routes
route.get('/user/:id/contato/index', contatoController.index);
route.post('/contato/register', contatoController.register);

module.exports = route;
