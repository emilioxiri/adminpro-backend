var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var ROLES = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} not is a valid role'
};

var usuarioSchema = new Schema({
    name: { type: String, required: [true, 'The name is required'] },
    email: { type: String, unique: true, required: [true, 'The email is required'] },
    password: { type: String, required: [true, 'The password is required'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: ROLES }
});

usuarioSchema.plugin(uniqueValidator, { message: 'The {PATH} must be unique' });
module.exports = mongoose.model('User', usuarioSchema);