const mongoose = require('mongoose');

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

let usuarioSchema = new Schema({
  nombre: {type: String, required: [true, 'El nombre es necesario']},
  email: {type: String, unique: true, required: [true, 'El correo es necesario']},
  password: {type: String, required: [true, 'La contraseña es obligatoria']},
  img: {type: String, require: false},
  role: {type: String, default: 'USER_ROLE', enum: rolesValidos},
  estado: {type: Boolean, default: true},
  google: {type: Boolean, default: false}
});

//Sobrescritura del objeto para no retornar el password
usuarioSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);
