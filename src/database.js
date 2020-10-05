//Usamos la dependencia de moongose para ejecutarse con mongodb y en la app
const mongoose = require('mongoose');

//Conexion a la bd con moongose para conectarse a mongodb y permitir accesos restringidos
mongoose.connect('mongodb://localhost/Detca_db', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    //mensajes en consola y errores que pueden presentarse
    .then(db => console.log('Db mongo conectada exitosamente'))
    .catch(err => console.log(err));
    