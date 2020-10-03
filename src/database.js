//Conexion a la bd
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Detca_d', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db => console.log('Db mongo conectada exitosamente'))
    .catch(err => console.log(err));
    