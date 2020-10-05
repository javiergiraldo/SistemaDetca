const express = require('express'); //MODULOS HTTP
const morgan = require('morgan'); //Captura solicitudes HTTP para Nodejs
const exphbs = require('express-handlebars'); //Plantila para render vistas
const path = require('path');
const socketIo = require("socket.io"); //Llamando desde la biblioteca websockets
const http = require("http"); //Módulos de http
const passport = require('passport'); //Módulo de autenticación para la administración de sesiones
const flash = require("connect-flash"); //Módulos para los mensajes
const session = require("express-session");
const cookiSession = require('cookie-session')
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');


//Inicializando
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
const app = express();
require('./database');
require('./config/passport');
const server = http.createServer(app); //Se llaman los módulos del servidor requerido
const io = socketIo.listen(server); //Usamos el objeto websockets para que se inicie en el server
//require('./lib/passport');

//Password y correo


//Arduino
//Websockets actualizando

//Comunicación con el puerto serial
io.on('connection', function (socket) {
    console.log('Nuevo socket conectado');
});

const Serialport = require('serialport');
const Readline = Serialport.parsers.Readline;

const port = new Serialport('COM3', {
    baudRate: 9600
});

const parser = port.pipe(new Readline({ delimeter: '\r\n' }));

parser.on('open', function (){
    console.log('conexión establecida');
});

parser.on('data', function (data){
        console.log(data);
    io.emit('Alcohol', data);
});

parser.on('error', function (err){
    console.log(err);
});

// const Serialport = require('serialport');
// const {
//     text
// } = require('express');
// const Readline = Serialport.parsers.Readline;

// const port = new Serialport('COM3', {
//     baudRate: 9600
// });

// port.on('open', function () {
//     console.log('Puerto serial conectado');
// });

// port.on('data', function (data) {
//     //console.log(data.toString());
//     io.emit('arduino:data', {
//         value: data.toString()
//     });
// });

// port.on('err', function (err) {
//     console.log(err.message);
// });

//SENSOR
// const parser = port.pipe(new Readline({
//     delimeter: '\r\n'
// }));

// parser.on('open', function () {
//     console.log('connection is opened');
// });

// parser.on('data', function (data) {
//     console.log(data);
//     io.emit('Alcohol', data);
// });

// parser.on('error', function (err) {
//     console.log(err);
// });

// const tipo_alertas = require('./models/tipo_alertas')

//Config
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    //helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Peticiones Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json()); //Recibir datos de tipo json
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(cookiSession());
app.use(methodOverride('_method'));
const MongoStore = connectMongo(session);
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
//     //store: new MongoStore({
//     //mongooseConnection: mongoose.connection
// }));
// app.use(cookiSession({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
//     //store: new MongoStore({
//     //mongooseConnection: mongoose.connection
// }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// app.use(express.urlencoded({ extended: false }));

//Variables Globales Autenticar
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});



//Routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/crud'));
//app.use('/Cruds', require('./routes/crud'));
//app.use(require('./routes/crud'));
// app.use(require('./views'));


//Public files
app.use(express.static(path.join(__dirname, 'public')));

//Iniciando Servidor
//  app.listen(app.get('port'), () => {
//      console.log('Servidor Conectado', app.get('port'));
//  });

//Para guardar los datos de arduino en la BD
// app.post("/views/capturas", (req, res) => {
//     console.log('POST /views/capturas')
//     console.log(req.body)

//     let capturas = new capturas()
//     capturas.nombre = req.body.nombre
//     capturas.cantidad = req.body.cantidad
//     capturas.fecha = req.body.fecha
//     capturas.save((err, capturasStored) => {
//     if (err) res.status(500).send({message: `Error al guardar en la base de datos: ${err}` 

//     res.status(200).send({capturas: capturasStored})

// })
// });

server.listen(4000, () => {
    console.log("Conexión en el puerto", 4000); //server ejecutando.
});