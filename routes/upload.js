const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

//middleware
app.use(fileUpload());

//Schemas
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//extensiones permitidas
const extensiones = ['png', 'jpg', 'gif', 'jpeg'];

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files) return res.status(400).json({ok: false, err:{message: 'No se ha seleccionado ningun archivo'}});

    //Validar parametro tipo
    if(['productos', 'usuarios'].indexOf(tipo) < 0) return res.status(400).json({ok: false, err: {message: 'Parametro tipo no válido'}});

    let archivo = req.files.archivo;
    let archivoSplit = archivo.name.split('.');
    let extension = archivoSplit.pop();

    if(extensiones.indexOf(extension) < 0) return res.status(400).json({ok: false, err: {message: 'Extension no permitida'}});

    //Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if(err) return res.status(500).json({ok: false, err});

        //Imagen cargada
        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }

    });
});


function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {
        if(err) return res.status(500).json({ok: false, err});

        if(!usuarioDB) return res.status(400).json({ok:false, err: {message: 'Usuario no existe'}});

        //Borrar imagen anterior
        let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        if(fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save( (err, usuarioGuardado) => {

            if(err) return res.status(500).json({ok: false, err});
            res.json({ok: true, usuario: usuarioGuardado});
        });
    });
}


function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) => {
        if(err) return res.status(500).json({ok: false, err});

        if(!productoDB) return res.status(400).json({ok:false, err: {message: 'Producto no existe'}});

        //Borrar imagen anterior
        let pathImagen = path.resolve(__dirname, `../../uploads/productos/${productoDB.img}`);
        if(fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);

        productoDB.img = nombreArchivo;
        productoDB.save( (err, productoGuardado) => {

            if(err) return res.status(500).json({ok: false, err});
            res.json({ok: true, producto: productoGuardado});
        });
    });
}


module.exports = app;
