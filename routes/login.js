var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var app = express();
var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;
var User = require('../models/user');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// GOOGLE AUTH
app.post('/google', async (request, response) => {
    var token = request.body.token;

    var googleUser = await verify(token).catch(error => {
        return response.status(500).json({
            ok: false,
            message: error,
            errors: error
        });
    });

    User.findOne({email: googleUser.email}, (error, dbUser) => {
        if (error) {
            return response.status(500).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        if(dbUser){
            if(!dbUser.google){
                return response.status(400).json({
                    ok: true,
                    message: 'There isnt a google user!',
                    errors: error
                });
            } else {
                var token = jwt.sign({ user: dbUser }, SEED, { expiresIn: 14400 });
                return response.status(200).json({
                    ok: true,
                    response: dbUser,
                    token: token
                });
            }
        } else {
            var user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((error, userSaved) => {
                var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

                return response.status(200).json({
                    ok: true,
                    response: userSaved,
                    token: token
                });
            });
        }
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log(payload);
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };
  }
  
// NORMAL AUTH
app.post('/', (request, response) => {
    var body = request.body;

    User.findOne({ email: body.email }, (error, user) => {
        if (error) {
            return response.status(500).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        if (!user) {
            return response.status(400).json({
                ok: true,
                message: 'The user with email ' + body.email + ' not exists!',
                errors: error
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return response.status(400).json({
                ok: true,
                message: 'Password error!',
                errors: error
            });
        }

        user.password = ':)';
        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

        response.status(200).json({
            ok: true,
            response: user,
            token: token
        });
    });
});

module.exports = app;