/* eslint-disable consistent-return */
/* eslint-disable arrow-parens */
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const { LoginModel } = require('../src/models/LoginModel');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      LoginModel.findOne({
        // eslint-disable-next-line object-shorthand
        email: email,
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Email nao cadastrado' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { message: 'Senha incorreta' });
        });
      });
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    LoginModel.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
