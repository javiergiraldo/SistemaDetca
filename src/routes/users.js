const express = require('express');
const router = express.Router();
var async = require("async");
var crypto = require("crypto");
const bcrypt = require('bcryptjs');
var nodemailer = require("nodemailer");
const {isAuthenticated} = require('../helpers/auth')

const User = require('../models/User');
const passport = require('passport');

router.get('/signup',  (req, res) => {
    res.render('auth/signup')
});

router.get("/signin", (req, res) => { //renderiza desde el get signin
    res.render("auth/signin"); //Lo muestra en el server el login
});

router.post("/signin", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
})); //renderiza desde el get signin
    

router.post("/signup", async (req, res) => { //renderiza desde el get signin
    const { nombre, apellido, telefono, correo, contraseña_us, confirm_contraseña_us } = req.body;
    //eval(require('locus'))
    const errors = [];
    if (nombre.length <= 0) {
         errors.push({text: 'Inserta tu Nombre'});
        //req.flash('error', 'Inserta tu nombre');
     }
    if (contraseña_us != confirm_contraseña_us) {
        errors.push({text: 'Contraseñas no coinciden' });
        //req.flash('error', 'Contraseñas no coinciden');
    }
    if (errors.length > 0) {
            res.render('auth/signup', {errors,nombre,apellido,telefono,correo,contraseña_us,confirm_contraseña_us})
    } else {
        const CorreoUser = await User.findOne({ correo: correo });
        if (CorreoUser) {
            req.flash('error_msg', 'El correo ya esta registrado, ingresa otro nuevamente');
            res.redirect('/signup');
        }
        const newUser = new User({ nombre, apellido, telefono, correo, contraseña_us });
           if (req.body.adminCode === 'admin123') {
               newUser.isAdmin = true;
           }
        // const newUser = new User({
        //     nombre : req.body.nombre,
        //     apellido: req.body.apellido,
        //     telefono: req.body.telefono,
        //     correo: req.body.correo,
        //     contraseña_us: req.body.contraseña_us
        // });
        //const salt = await bcrypt.genSalt(10);
        //newUser.contraseña_us = await bcrypt.hash(contraseña_us, salt);
        newUser.contraseña_us = await newUser.encryptPassword(contraseña_us);
        await newUser.save();
        req.flash("success_msg", "Acabas de ser Registrado.");
        res.redirect("/signin");
        // bcrypt.genSalt(10, (err, salt) => {
        //     bcrypt.hash(newUser.contraseña_us, salt, (err, hash) => {
        //         if (err) throw err;
        //         newUser.contraseña_us = hash;
        //         newUser.save().then(user => {
        //             req.flash('success_msg , Acabas de ser Registrado');
        //             res.redirect('/signin');
        //         })
        //             .catch(err => console.log(err));
        //     });
        // });
        //await newUser.save();
        //req.flash('success_msg', 'Acabas de ser Registrado')
        //res.redirect('/signin')
    }
    
});
router.get('/logout', isAuthenticated, (req, res) => {
    req.logOut();
        res.redirect('/signin'); //Inside a callback… bulletproof!
});

router.get('/profile',isAuthenticated, (req, res) => {
    res.render('profile')
});

 router.get('/forgot', (req, res) => {
     res.render('auth/forgot')
 });

//   router.get('/reset', (req, res) => {
//       res.render('reset')
//  });

 router.post('/forgot', function (req, res, next) {
     async.waterfall([
         function (done) {
             crypto.randomBytes(20, function (err, buf) {
                 var token = buf.toString('hex');
                 done(err, token);
             });
         },
         function (token, done) {
             User.findOne({ correo: req.body.correo }, function (err, user) {
                 if (!user) {
                     req.flash('error', 'No existe el correo , Digita uno ya registrado.');
                     return res.redirect('/forgot');
                 }
                 user.resetPasswordToken = token;
                 user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                 user.save(function (err) {
                     done(err, token, user);
                 });
             });
         },
         function (token, user, done) {
             var trasporter = nodemailer.createTransport({
                 service: 'Gmail',
                 auth: {
                        user: 'detcasoporte@gmail.com',
                        pass: 'sistemadetca2'
                 }
             });
             var mailOptions = {
                 to: user.correo,
                 from: 'detcasoporte@gmail.com',
                 subject: 'Recuperacion de su Contraseña',
                 text: 'Estas Recibiendo esto debido a que tu o alguien mas ha solicitado la recuperacion de la contraseña en Sistema Detca.\n\n' +
                     'Por favor ingresar al siguiente link  :\n\n' +
                     'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                     'Si no lo has solicitado , por favor ignora este correo , Tu contraseña no sera cambiada.\n'
             };
             trasporter.sendMail(mailOptions, function (err) {
                 console.log('Correo enviado');
                 req.flash('success_msg', 'Un correo se ha enviado a  ' + user.correo + ' Con las respectivas Instrucciones.');
                 done(err, 'done');
             });
         }
     ], function (err) {
         if (err) return next(err);
         res.redirect('/forgot');
     });
 });

 router.get('/reset/:token', function (req, res) {
     User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
         if (!user) {
             req.flash('error', 'La solicitud de recuperacion de contraseña ya ha sido usado o ya ha caducado.');
             return res.redirect('/forgot');
         }
         res.render('reset', { token: req.params.token });
     });
 });

 router.post('/reset/:token', function (req, res) {
     async.waterfall([
         function (done) {
             User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function (err, user) {
                 if (!user) {
                     req.flash('error', 'Password reset token is invalid or has expired.');
                     return res.redirect('back');
                 }
                 if (req.body.contraseña_us === req.body.confirm_contraseña_us) {
                     user.setPassword(req.body.contraseña_us, function (err, user) {
                         if (err) {
                             console.log(err)
                             req.flash('error', 'Lo sentimos algo ha ido mal, intentalo nuevamente')
                             return res.redirect('back')
                         } else {
                         user.contraseña_us = req.body.contraseña_us;
                         user.resetPasswordToken = undefined;
                         user.resetPasswordExpires = undefined;
                         console.log('contraseña_us' + user.contraseña_us + ' correo' + user)
                         user.save(function (err) {
                             req.logIn(user, function (err) {
                                 done(err, user);
                             });
                         });
                        }
                     })
                } else {
                     req.flash("error", "Las contraseñas no coinciden.");
                     return res.redirect('back');
                 }
             });
         },
         function (user, done) {
             var trasporter = nodemailer.createTransport({
                 service: 'Gmail',
                 auth: {
                        user: 'detcasoporte@gmail.com',
                        pass: 'sistemadetca2'
                 }
             });
             var mailOptions = {
                 to: user.correo,
                 from: 'detcasoporte@gmail.com',
                 subject: 'Tu contraseña ha sido cambiada ',
                 text: 'Hola,\n\n' +
                     'Esta es una confirmacion de que tu contraseña con el correo ' + user.correo + ' ha sido cambiada.\n'
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

module.exports = router;