//Renderizamos la vista principal
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

//Renderizamos la vista de capturas
router.get('/capturas', (req, res) => {
    res.render('capturas')
});

//Exportamos el modulo
module.exports = router;