var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

//===============================================
//  Verificar token                            
//===============================================

exports.verifyToken = (request, response, next) => {
    var token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: true,
                message: 'Error in DB!',
                errors: error
            });
        }

        request.user = decoded.user;

        next();
    });
};