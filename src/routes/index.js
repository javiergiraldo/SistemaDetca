//Renderizamos la vista principal
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/capturas', (req, res) => {
    res.render('capturas')
});

module.exports = router;