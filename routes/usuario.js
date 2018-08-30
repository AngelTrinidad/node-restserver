const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificarToken, verificarRol} = require('../middlewares/autenticacion');

const app = express();

//El segundo parametro es el middleware, se pasa la function, sin parentesis
app.get('/usuario', verificarToken, (req, res) => {

  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  //Primer parametro, filtros, segundo, campos a mostrar
  Usuario.find({estado:true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {

      if(err){
        return res.status(400).json({
          ok: false,
          status: 400,
          err
        });
      }

      //Count: mismos filtros del find
      Usuario.countDocuments({estado:true}, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          total: conteo
        });
      });
    });
});

app.post('/usuario', [verificarToken, verificarRol], function (req, res) {

  let body = req.body;

  //Schema
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  //Save
  usuario.save((err, usuarioDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        status: 400,
        err
      });
    }

    res.json({
      persona: usuarioDB
    });

  });

});

app.put('/usuario/:id', verificarToken, function (req, res) {
  //Falta validacion de correo, en el caso de que envie el mismo correo que la base

  let id = req.params.id;

  //filtrado de campos permitidos con el underscore
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, usuarioDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});

app.delete('/usuario/:id', [verificarToken, verificarRol], function (req, res) {

  let id = req.params.id;

  //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  let cambiaEstado = {estado:false}
  Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true},(err, usuarioBorrado) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      deleted: usuarioBorrado
    });
  });
});

module.exports = app;
