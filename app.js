// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();

//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importar routas
var appRoute = require('./routes/pathRoute');
var userRoute = require('./routes/user');
var loginRoute = require('./routes/login');
var doctorRoute = require('./routes/doctor');
var hospitalRoute = require('./routes/hospital');
var searchRoute = require('./routes/search');
var uploadRoute = require('./routes/upload');
var imagesRoute = require('./routes/images');

// Conexion a la BDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error) => {
    if (error) throw error;
    console.log('MongoDB in localhost:27017: \x1b[32m%s\x1b[0m', ' online.');
});

//Server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//Rutas
app.use('/login', loginRoute);
app.use('/doctor', doctorRoute);
app.use('/hospital', hospitalRoute);
app.use('/user', userRoute);
app.use('/search', searchRoute);
app.use('/upload', uploadRoute);
app.use('/img', imagesRoute);
app.use('/', appRoute);


//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server in port 3000: \x1b[32m%s\x1b[0m', ' online.');
});