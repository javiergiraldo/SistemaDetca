const express = require('express');
const router = express.Router();

const User = require('../models/User');
const admin = require('../routes/users');

router.get('/usuarios', async (req, res) => {
    const users = await User.find().lean()
    if (users.isAdmin = true) {
        res.render('crud/usuarios', { users });
    } else {
        req.flash("error_msg", "Acceso restringido.");
        res.redirect('/profile');
    }
});

router.get('/add', (req, res, next) => {
    res.render('crud/add');
});

//metodo para agreagr ususarios como ADMIN 
router.post("/add", async (req, res) => {
    const {nombre, apellido,telefono,correo,contraseña_us,confirm_contraseña_us} = req.body;
    //eval(require('locus'))
    const errors = [];
    if (nombre.length <= 0) {
        errors.push({
            text: 'Inserta tu Nombre'
        });
    }
    //Confirmar contraseñas
    if (contraseña_us != confirm_contraseña_us) {
        errors.push({
            text: 'Contraseñas no coinciden'
        });
    }
    //Validar errores
    if (errors.length > 0) {
        res.render('crud/add', {
            errors,
            nombre,
            apellido,
            telefono,
            correo,
            contraseña_us,
            confirm_contraseña_us
        })
        //buscamos los correos de usuarios que no existan en la coleccion de la bd usuario
    } else {
        const CorreoUser = await User.findOne({
            correo: correo
        });
        if (CorreoUser) {
            req.flash('error_msg', 'El correo ya esta registrado, ingresa otro nuevamente');
            res.redirect('/add');
        }
        const newUser = new User({
            nombre,
            apellido,
            telefono,
            correo,
            contraseña_us
        });
        if (req.body.adminCode === 'admin123') {
            newUser.isAdmin = true;
        }

        //Encryptamos la contraseña
        newUser.contraseña_us = await newUser.encryptPassword(contraseña_us);
        await newUser.save();
        req.flash("success_msg", "Nuevo Usuario Registrado.");
        res.redirect("/usuarios");
    }
});

//Metodo para renderizar la vista editar el usuario
router.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id).lean()
    res.render('crud/edit', { user });
});

//Metodo para enviar y guardar los datos del usuario a la bd
router.put('/edit/:id', async (req, res) => {
    const { nombre, apellido, telefono, correo } = req.body;
    await User.findByIdAndUpdate(req.params.id, { nombre, apellido, telefono, correo });
    req.flash('success_msg', 'Usuario Actualizado');
    res.redirect('/usuarios')
});

//Metodo para eliminar usuarios ADMIN
router.delete('/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('error_msg', 'Usuario Eliminado');
    res.redirect('/usuarios')
});

//exportamos el controlador
module.exports = router;