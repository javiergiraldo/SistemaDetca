//Dependecia passport que nos permite validar el usuario si esta registrado y loggeado
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const helpers = require("../helpers/auth");

const User = require('../models/User');

//Usamos passport para buscar correo no existe
passport.use(new LocalStrategy({
    usernameField: 'correo',
    passwordField: "contraseña_us",
}, async (correo, contraseña_us, done) => {
    const user = await User.findOne({ correo: correo });
    if (!user) {
        return done(null, false, { message: "El Correo no existe o es incorrecto, Intentelo nuevamente" });
    } else {
        //Usamos el método para comparar las contraseñas
        bcrypt.compare(contraseña_us, user.contraseña_us, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
        });
    }
}));
 
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});