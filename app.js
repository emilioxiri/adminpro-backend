// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();


// Conexion a la BDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if (error) throw error;
    console.log('MongoDB in localhost:27017: \x1b[32m%s\x1b[0m', ' online.');
});

//Rutas
app.get('/', (request, reponse, next) => {
    reponse.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});


//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server in port 3000: \x1b[32m%s\x1b[0m', ' online.');
});