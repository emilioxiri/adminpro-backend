var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var middlewareAuth = require('../middlewares/authentication');
//Rutas

//===============================================
//  Obtener hospitales                            
//===============================================
app.get('/', (request, reponse) => {
    var from = Number(request.query.from) || 0;

    Hospital.find({})
    .skip(from)
    .limit(2)
    .populate('user', 'name email')
        .exec((error, hospitals) => {
            if (error) {
                return reponse.status(500).json({
                    ok: true,
                    message: 'Error in DB!',
                    errors: error
                });
            }

            Hospital.count({}, (error, count) => {
                reponse.status(200).json({
                    ok: true,
                    hospitals: hospitals,
                    count: count
                });
            });
        });
});



//===============================================
//  Guardar hospital                            
//===============================================
app.post('/', middlewareAuth.verifyToken, (request, response) => {
    var body = request.body;
    var hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: body.user
    });

    hospital.save((error, savedHospital) => {
        if (error) {
            return response.status(400).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        response.status(200).json({
            ok: true,
            hospital: savedHospital,
            author: request.user
        });
    });
});

//===============================================
//  Actualizar hospital                          
//===============================================
app.put('/:id', middlewareAuth.verifyToken, (request, reponse) => {
    var id = request.params.id;
    Hospital.findById(id, (error, hospital) => {
        if (error) {
            return reponse.status(500).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        if (!hospital) {
            return reponse.status(400).json({
                ok: true,
                message: 'The hospital with id ' + id + ' not exists!',
                errors: error
            });
        }
        var body = request.body;
        hospital.name = body.name;
        hospital.img = body.img;
        hospital.user = body.user;

        hospital.save((error, savedHospital) => {
            if (error) {
                return reponse.status(400).json({
                    ok: true,
                    message: 'Error in DB!',
                    errors: error
                });
            }

            reponse.status(200).json({
                ok: true,
                hospital: savedHospital
            });
        });
    });
});

//===============================================
//  Borrar hospital                            
//===============================================
app.delete('/:id', middlewareAuth.verifyToken, (request, reponse) => {
    var id = request.params.id;

    Hospital.findByIdAndDelete(id, (error, response) => {
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