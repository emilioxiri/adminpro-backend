var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var middlewareAuth = require('../middlewares/authentication');
//Rutas

//===============================================
//  Obtener usuarios                            
//===============================================
app.get('/', (request, reponse) => {

    User.find({}, 'name email img role')
        .exec((error, users) => {
            if (error) {
                return reponse.status(500).json({
                    ok: true,
                    message: 'Error in DB!',
                    errors: error
                });
            }
            reponse.status(200).json({
                ok: true,
                users: users
            });
        });
});



//===============================================
//  Guardar usuario                            
//===============================================
app.post('/', middlewareAuth.verifyToken, (request, response) => {
    var body = request.body;
    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((error, savedUser) => {
        if (error) {
            return response.status(400).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        response.status(200).json({
            ok: true,
            user: savedUser,
            author: request.user
        });
    });
});

//===============================================
//  Actualizar usuario                          
//===============================================
app.put('/:id', middlewareAuth.verifyToken, (request, reponse) => {
    var id = request.params.id;
    User.findById(id, (error, user) => {
        if (error) {
            return reponse.status(500).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        if (!user) {
            return reponse.status(400).json({
                ok: true,
                message: 'The user with id ' + id + ' not exists!',
                errors: error
            });
        }
        var body = request.body;
        user.name = body.name;
        user.mail = body.mail;
        user.role = body.role;

        user.save((error, savedUser) => {
            if (error) {
                return reponse.status(400).json({
                    ok: true,
                    message: 'Error in DB!',
                    errors: error
                });
            }

            savedUser.password = ':)';

            reponse.status(200).json({
                ok: true,
                user: savedUser
            });
        });
    });
});

//===============================================
//  Borrar usuario                            
//===============================================
app.delete('/:id', middlewareAuth.verifyToken, (request, reponse) => {
    var id = request.params.id;

    User.findByIdAndDelete(id, (error, response) => {
        if (error) {
            return reponse.status(400).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        reponse.status(200).json({
            ok: true,
            response: response
        });
    });
});

module.exports = app;