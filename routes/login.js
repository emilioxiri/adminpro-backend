var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var app = express();
var SEED = require('../config/config').SEED;
var User = require('../models/user');

app.post('/', (request, reponse) => {
    var body = request.body;

    User.findOne({ email: body.email }, (error, user) => {
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
                message: 'The user with email ' + body.email + ' not exists!',
                errors: error
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return reponse.status(400).json({
                ok: true,
                message: 'Password error!',
                errors: error
            });
        }

        user.password = ':)';
        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

        reponse.status(200).json({
            ok: true,
            response: user,
            token: token
        });
    });
});

module.exports = app;