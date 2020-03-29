var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var Doctor = require('../models/doctor');
var jwt = require('jsonwebtoken');
var middlewareAuth = require('../middlewares/authentication');
//Rutas

//===============================================
//  Obtener doctores                            
//===============================================
app.get('/', (request, reponse) => {
    var from = Number(request.query.from) || 0;

    Doctor.find({})
    .skip(from)
    .limit(2)
    .populate('user', 'name email')
    .populate('hospital')
        .exec((error, doctors) => {
            if (error) {
                return reponse.status(500).json({
                    ok: true,
                    message: 'Error in DB!',
                    errors: error
                });
            }

            Doctor.count({}, (error, count) => {
                reponse.status(200).json({
                    ok: true,
                    doctors: doctors,
                    count: count
                });
            });
        });
});



//===============================================
//  Guardar doctor                            
//===============================================
app.post('/', middlewareAuth.verifyToken, (request, response) => {
    var body = request.body;
    var doctor = new Doctor({
        name: body.name,
        img: body.img,
        user: body.user,
        hospital: body.hospital
    });

    doctor.save((error, savedDoctor) => {
        if (error) {
            return response.status(400).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        response.status(200).json({
            ok: true,
            doctor: savedDoctor,
            author: request.user
        });
    });
});

//===============================================
//  Actualizar doctor                          
//===============================================
app.put('/:id', middlewareAuth.verifyToken, (request, reponse) => {
    var id = request.params.id;
    Doctor.findById(id, (error, doctor) => {
        if (error) {
            return reponse.status(500).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        if (!doctor) {
            return reponse.status(400).json({
                ok: true,
                message: 'The doctor with id ' + id + ' not exists!',
                errors: error
            });
        }
        var body = request.body;
        doctor.name = body.name;
        doctor.img = body.img;
        doctor.user = body.user;
        doctor.hospital = body.hospital;

        doctor.save((error, savedDoctor) => {
            if (error) {
                return reponse.status(400).json({
                    ok: true,
                    message: 'Error in DB!',
                    errors: error
                });
            }

            reponse.status(200).json({
                ok: true,
                doctor: savedDoctor
            });
        });
    });
});

//===============================================
//  Borrar doctor                            
//===============================================
app.delete('/:id', middlewareAuth.verifyToken, (request, reponse) => {
    var id = request.params.id;

    Doctor.findByIdAndDelete(id, (error, response) => {
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