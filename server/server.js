require ('./config/config');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

//Middleware bodyparser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//middleware para habilitar el public
app.use(express.static(path.resolve(__dirname, '../public')));

//index route
app.use(require('../routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
  if(err) throw err;
  console.log('BASE DE DATOS ONLINE');
});

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto: ${process.env.PORT}`));
