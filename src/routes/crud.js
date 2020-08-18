const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/usuarios', async (req, res) => {
    const users = await User.find({}).lean()
    res.render('crud/usuarios', { users });
});

router.get('/add', (req, res, next) => {
    res.render('crud/add');
});

router.post("/add", async (req, res) => { //renderiza desde el get signin
    const {nombre, apellido,telefono,correo,contraseña_us,confirm_contraseña_us} = req.body;
    //eval(require('locus'))
    const errors = [];
    if (nombre.length <= 0) {
        errors.push({
            text: 'Inserta tu Nombre'
        });
        //req.flash('error', 'Inserta tu nombre');
    }
    if (contraseña_us != confirm_contraseña_us) {
        errors.push({
            text: 'Contraseñas no coinciden'
        });
    }
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
        newUser.contraseña_us = await newUser.encryptPassword(contraseña_us);
        await newUser.save();
        req.flash("success_msg", "Nuevo Usuario Registrado.");
        res.redirect("/usuarios");
    }
});

router.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id).lean()
    res.render('crud/edit', { user });
});

router.put('/edit/:id', async (req, res) => {
    const { nombre, apellido, telefono, correo } = req.body;
    await User.findByIdAndUpdate(req.params.id, { nombre, apellido, telefono, correo });
    res.redirect('/usuarios')
});

router.delete('/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/usuarios')
});


module.exports = router;