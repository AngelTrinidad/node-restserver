const express = require('express');
let {verificarToken} = require('../middlewares/autenticacion');
let Producto = require('../models/producto');

let app = express();

app.get('/productos', verificarToken,(req, res) => {

  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Producto.find({disponible: true})
    .sort('nombre')
    .skip(desde)
    .limit(limite)
    .populate('categoria')
    .populate('usuario')
    .exec( (err, productos) => {

      if(err) return res.status(500).json({ok: false, err});

      return res.status(200).json({ok: true, productos});
    });
});

app.get('/producto/:id', verificarToken,(req, res) => {

  const id = req.params.id;
  Producto.findById(id, (err, productoDB) => {

    if(err) return res.status(500).json({ok: false, err});

    if(!productoDB) return res.status(400).json({ok:false, err: {message: 'Id no corresponde'}});

    return res.json({ok: true, producto: productoDB});
  });
});

app.post('/producto', verificarToken,(req, res) => {

    let body = req.body;

    let producto = new Producto({
      nombre: body.nombre,
      precioUni: body.precio,
      descripcion: body.descripcion,
      disponible: body.disponible,
      categoria: body.idCategoria,
      usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {

      if(err) return res.status(500).json({ok:false, err});

      res.status(201).json({ok:true, producto: productoDB});
    });
});

app.put('/producto/:id', verificarToken,(req, res) => {

  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {

    if(err) return res.status(500).json({ok:false, err});

    if(!productoDB) return res.status(400).json({ok:false, err: {message: 'El id no existe'}});

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precio;
    productoDB.descripcion = body.descripcion || productoDB.descripcion;
    productoDB.disponible = body.disponible || productoDB.disponible;
    productoDB.categoria = body.idCategoria || productoDB.categoria;

    productoDB.save( (err, productoSave) => {

      if(err) return res.status(500).json({ok:false, err});

      return res.json({ok: true, producto: productoSave});
    });


  });
});



module.exports = app;
