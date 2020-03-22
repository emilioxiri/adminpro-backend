var express = require('express');
var app = express();

//Rutas
app.get('/', (request, reponse, next) => {
    reponse.status(200).json({
        ok: true,
        message: 'Request completed!'
    });
});

module.exports = app;