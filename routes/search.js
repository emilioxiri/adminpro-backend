var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User  = require('../models/user');

// ==================================
//  BY COLLECTION
// ==================================

app.get('/collection/:table/:find', (request, reponse) => {
    var find = new RegExp(request.params.find, 'i');
    var table = request.params.table;
    var promise;

    switch (table) {
        case 'doctors':
            promise = findDoctors(find); 
            break;
        case 'hospitals':
            promise = findHospitals(find);
            break;
        case 'users':
            promise = findUsers(find); 
            break;
        default:
            return reponse.status(400).json({
                ok: true,
                error: 'This collections doent exists'
            });
    }

    promise.then(data => {
        reponse.status(200).json({
            ok: true,
            [table]: data
        });        
    });
});

// ==================================
//              GENERAL
// ==================================

app.get('/all/:find', (request, reponse, next) => {
    var regExp = new RegExp(request.params.find, 'i');
    Promise.all([findHospitals(regExp), findDoctors(regExp), findUsers(regExp)]).then(responses => {
        reponse.status(200).json({
            ok: true,
            hospitals: responses[0],
            doctors: responses[1],
            users: responses[2]
        });        
    });
});


function findHospitals(regExp) {
    return new Promise((resolve, reject) => {
        Hospital.find({name: regExp})
        .populate('user', 'name email')
        .exec((error, hospitals) => {
            if(error){
                reject('Error searching hospitals', error);
            } else {
                resolve(hospitals);
            }
        });
    });
}

function findDoctors(regExp) {
    return new Promise((resolve, reject) => {
        Doctor.find({name: regExp})
        .populate('user', 'name email')
        .exec((error, doctors) => {
            if(error){
                reject('Error searching doctors', error);
            } else {
                resolve(doctors);
            }
        });
    });
}

function findUsers(regExp) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{'name': regExp}, {'email': regExp}])
            .exec( (error, users) => {
                if(error){
                    reject('Error searching users', error);
                } else {
                    resolve(users);
                }
        });
    });
}

module.exports = app;