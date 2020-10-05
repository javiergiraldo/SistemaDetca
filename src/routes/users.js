//Controlador del usuario
const express = require('express');//usamos express para ejcutar el servidor
const router = express.Router();//Usamos la ruta de express

var async = require("async");//Usar las funciones asyncronas
var crypto = require("crypto");//encryptar los tokens
const bcrypt = require('bcryptjs');//Encryptar contraseña
var nodemailer = require("nodemailer");//Dependencia para reuceprar contraseña por correo
const {isAuthenticated} = require('../helpers/auth')//Usamos helpers para autenticar rutas

//Usamos modelo y passport de usuario
const User = require('../models/User');
const passport = require('passport');

//Metodo para renderizar vista de registro
router.get('/signup',  (req, res) => {
    res.render('auth/signup')
});

//Metodo para renderizar login
router.get("/signin", (req, res) => { //renderiza desde el metodo logeo
    res.render("auth/signin"); //Lo muestra en el server el login
});

//Metodo para ejecutar login
router.post("/signin", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
})); //renderiza desde el get signin
    
//metodo para renderizar la vista de registro
router.post("/signup", async (req, res) => { 
    const { nombre, apellido, telefono, correo, contraseña_us, confirm_contraseña_us } = req.body;
    //Aqui validamos los errores y se guardan en un Array llamado errors
    const errors = [];
    if (nombre.length <= 0) {
         errors.push({text: 'Inserta tu Nombre'});
        //req.flash('error', 'Inserta tu nombre');
     }
    if (contraseña_us != confirm_contraseña_us) {
        errors.push({text: 'Contraseñas no coinciden' });
        //req.flash('error', 'Contraseñas no coinciden');
    }
    //condicion para validar errores
    if (errors.length > 0) {
            res.render('auth/signup', {errors,nombre,apellido,telefono,correo,contraseña_us,confirm_contraseña_us})
    } else {
        const CorreoUser = await User.findOne({ correo: correo });
        if (CorreoUser) {
            req.flash('error_msg', 'El correo ya esta registrado, ingresa otro nuevamente');
            res.redirect('/signup');
        }
        //Guardamos nuevo usuario
        const newUser = new User({ nombre, apellido, telefono, correo, contraseña_us });
           if (req.body.adminCode === 'admin123') {
               newUser.isAdmin = true;
           }
        //Encriptamos la contraseña con las dependecias de bcrypt
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.contraseña_us, salt, (err, hash) => {
                if (err) throw err;
                newUser.contraseña_us = hash;
                newUser.save().then(user => {
                    req.flash("success_msg", " Acabas de ser Registrado");
                    res.redirect('/signin');
                })
                //capturar errores desde consola
                    .catch(err => console.log(err));
            });
        });
    }
    
});

//Metodo de cerrar sesion
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success_msg", "Has cerrado session.");
    res.redirect("/signin");
});  

//Método para validar y renderizar el ingreso al sistema
router.get('/profile',isAuthenticated, (req, res) => {
    res.render('profile')
});

//Método para renderizar la recuperacion de contraseña
 router.get('/forgot', (req, res) => {
     res.render('auth/forgot')
 });

//Aquí comenzamos a usar funciones y dependecias necesarias para recueperar contraseña y tokens desde la BD
 router.post('/forgot', function (req, res, next) {
     async.waterfall([
         function (done) {
             crypto.randomBytes(20, function (err, buf) {
                 var token = buf.toString('hex');
                 done(err, token);
             });
         },
         //Buscamos dentro de las colecciones del usuario en la bd para validar que el correo exista o sea incorrecto
         function (token, done) {
             User.findOne({ correo: req.body.correo }, function (err, user) {
                 if (!user) {
                     req.flash('error', 'No existe el correo o es incorrecto , Digita uno ya registrado.');
                     return res.redirect('/forgot');
                 }
                 //Guardamos el token y le damos un tiempo para que el usuario tenga tiempo de ingresar al correo y e ingresar una nueva
                 user.resetPasswordToken = token;
                 user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de tiempo
                //Guardamos
                 user.save(function (err) {
                     done(err, token, user);
                 });
             });
         },
         //Función de nodemailer para ingresar  el correo de soporte y enviar las instrucciones al usuario que desea recuperar su contraseña
         function (token, user, done) {
             var trasporter = nodemailer.createTransport({
                 service: 'Gmail',
                 auth: {
                        user: 'detcasoporte@gmail.com',
                        pass: 'sistemadetca2020'
                 }
             });
             //Mas instrucciones para el usuario
             var mailOptions = {
                 to: user.correo,
                 from: 'detcasoporte@gmail.com',
                 subject: 'Recuperacion de su Contraseña',
                 text: 'Estas Recibiendo esto debido a que tu o alguien mas ha solicitado la recuperacion de la contraseña en Sistema Detca.\n\n' +
                     'Por favor ingresar al siguiente link  :\n\n' +
                     'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                     'Si no lo has solicitado , por favor ignora este correo , Tu contraseña no sera cambiada.\n'
             };
             //Finalmente enviamos el correo al usuario que este registrado y validado en la coleccion
             trasporter.sendMail(mailOptions, function (err) {
                 console.log('Correo enviado');
                 req.flash('success_msg', 'Un correo se ha enviado a  ' + user.correo + ' Con las respectivas Instrucciones para la recuperacion de contraseñá.');
                 done(err, 'done');
             });
         }
         //Redirigimos al usuario a una nueva vista 
     ], function (err) {
         if (err) return next(err);
         res.redirect('/forgot');
     });
 });

 //Método para validar el token no sea valido o ya este vencido o expirado , lo redirigimos a la vista anterior para que ingrese nuevamente el correo
 router.get('/reset/:token', function (req, res) {
     User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
         if (!user) {
             req.flash('error', 'La solicitud de recuperacion de contraseña ya ha sido usado o ya ha caducado.');
             return res.redirect('/forgot');
         }
         res.render('reset', { token: req.params.token });
     });
 });

 //Método para validar el token desde una nueva vista no sea valido o ya este vencido o expirado , lo redirigimos a la vista anterior para que ingrese nuevamente el correo
 router.post('/reset/:token', function (req, res) {
     async.waterfall([
         function (done) {
             User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function (err, user) {
                 if (!user) {
                     req.flash('error', 'Token no valido.');
                     return res.redirect('back');
                 }
                 //Ya si todo es correcto validamos la contraseña en los campos de recuperación
                 if (req.body.contraseña_us === req.body.confirm_contraseña_us) {         
                           bcrypt.genSalt(10, (err, salt) => {
                               bcrypt.hash(req.body.contraseña_us, salt, (err, hash) => {
                                   if (err) throw err;
                                   user.contraseña_us = hash;
                                   user.save().then(user => {
                                           req.flash("success_msg", " Contraseña Cambiada");
                                           res.redirect('/signin');
                                       })
                                       .catch(err => console.log(err));
                               });
                           });
                           //para validar los tokens
                         user.resetPasswordToken = undefined;
                         user.resetPasswordExpires = undefined;
                         console.log('contraseña_us' + user.contraseña_us + ' correo' + user)
                } else {
                     req.flash("error", "Las contraseñas no coinciden.");
                     return res.redirect('back');
                 }
             });
         },
         //Funciones para que enviarle al correo que puedo recuperar la contraseña correctamente
         function (user, done) {
             var trasporter = nodemailer.createTransport({
                 service: 'Gmail',
                 auth: {
                        user: 'detcasoporte@gmail.com',
                        pass: 'sistemadetca2020'
                 }
             });
             //Usamos la opcion de nodemailer para enviar otro correo si se deseas
             var mailOptions = {
                 to: user.correo,
                 from: 'detcasoporte@gmail.com',
                 subject: 'Tu contraseña ha sido cambiada ',
                 text: 'Hola,\n\n' +
                     'Esta es una confirmación de que tu contraseña con el correo ' + user.correo + ' ha sido cambiada correctamente.\n'
             };
             trasporter.sendMail(mailOptions, function (err) {
                 req.flash('success_msg', 'Tu contraseña ha sido cambiada.');
                 done(err);
             });
         }
     ], function (err) {
         res.redirect('/signin');
     });
 });

 //Exportamos el módulo a las rutas
module.exports = router;