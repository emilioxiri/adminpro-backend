var express = require('express');
var app = express();
const path = require('path');
var fs = require('fs');

//Rutas
app.get('/:type/:img', (request, reponse, next) => {
    var type = request.params.type;
    var img = request.params.img;
    var pathImage = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if(fs.existsSync(pathImage)){
        reponse.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, `../assets/no-image.jpg`);
        reponse.sendFile(pathNoImage);
    }
});

module.exports = app;