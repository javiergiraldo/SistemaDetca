//Dependecia passport que nos permite validar el usuario si esta registrado y loggeado
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;//LLamamamos las librerias internas
const bcrypt = require('bcryptjs'); //Usamos las dependencias para encryptar las contraseñas

const helpers = require("../helpers/auth");//Validar cierre sesion 

const User = require('../models/User');//Usamos el modelo de la bsae datos usuario

//Usamos passport para validar que el usuario pueda ingresar correct amente
passport.use(new LocalStrategy({
    //campos de correo y contraseña
    usernameField: 'correo',
    passwordField: "contraseña_us",
}, async (correo, contraseña_us, done) => {
    const user = await User.findOne({ correo: correo }); //para buscar si el correo existe o no
    if (!user) {
        return done(null, false, { message: "El Correo no existe o es incorrecto, Intentelo nuevamente" });
    } else {
        //Usamos el método para comparar las contraseñas
        bcrypt.compare(contraseña_us, user.contraseña_us, (err, isMatch) => {
            if (err) throw err;
            //condicion para validar que si coincidan las contraseñas
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
        });
    }
}));
 
//Serializamos el usuario si es correcto 
passport.serializeUser(function(user, done) {
  done(null, user);
});

//Deserializamos el usuario para cerrar sesion
passport.deserializeUser(function(user, done) {
  done(null, user);
});