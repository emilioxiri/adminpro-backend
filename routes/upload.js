var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User  = require('../models/user');

app.use(fileUpload());

//Rutas
app.put('/:type/:id', (request, reponse, next) => {
    var validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    var type = request.params.type;
    var id = request.params.id;
    
    if(!request.files) {
        errorResponse(reponse, 'No files founded in request');
    }

    var file = request.files.img;
    var filenameSplitted = file.name.split('.');
    var extension = filenameSplitted[filenameSplitted.length -1];

    if(validExtensions.indexOf(extension) < 0 ) {
        errorResponse(reponse, 'Invalid extension');
    }

    var newFilename = `${id} - ${new Date().getMilliseconds()}.${extension}`;
    var path = `./uploads/${type}/${newFilename}`;

    file.mv(path, error => {
        if(error){
            errorResponse(reponse, 'Error when the server tries to move the file');
        }
    });

    uploadByType( type, id, newFilename, reponse );
});

function uploadByType( type, id, name, response ){
    var promise;
    var oldPath = `./uploads/${type}/`;

    if(type === 'users'){
        promise = findUsersByIdAndUpdateIt(id, name, oldPath);
    } else if (type === 'doctors'){
        promise = findDoctorsByIdAndUpdateIt(id, name, oldPath);
    } else {
        promise = findHospitalsByIdAndUpdateIt(id, name, oldPath);
    }

    promise.then(data => {
        response.status(200).json({
            ok: true,
            [type]: data
        });        
    });
}

function findUsersByIdAndUpdateIt(id, name, oldPath) {
    return new Promise((resolve, reject) => {
        User.findById(id, (error, user) => {
                if(error){
                    reject('Error searching user by id', error);
                } else {
                    checkOldPath(oldPath + user.img);
                    user.img = name;
                    user.save(user, (error, userUpdated) => {
                        resolve(userUpdated);
                    });
                }
        });
    });
}

function findHospitalsByIdAndUpdateIt(id, name, oldPath) {
    return new Promise((resolve, reject) => {
        Hospital.findById(id, (error, hospital) => {
            if(error){
                reject('Error searching hospitals', error);
            } else {
                checkOldPath(oldPath + hospital.img);
                hospital.img = name;
                hospital.save(hospital, (error, hospitalUpdated) => {
                    resolve(hospitalUpdated);
                });
            }
        });
    });
}

function findDoctorsByIdAndUpdateIt(id, name, oldPath) {
    return new Promise((resolve, reject) => {
        Doctor.findById(id, (error, doctor) => {
            if(error){
                reject('Error searching doctor by id', error);
            } else {
                checkOldPath(oldPath + doctor.img);
                doctor.img = name;
                doctor.save(doctor, (error, doctorUpdated) => {
                    resolve(doctorUpdated);
                });
            }
        });
    });
}

function checkOldPath(path) {
    if(fs.existsSync(path)){
        fs.unlink(path);
    }
}

function errorResponse(message, reponse){
    reponse.status(400).json({
        ok: false,
        message: message
    });
}

module.exports = app;