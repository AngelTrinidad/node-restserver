require ('./config/config');


const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

//Middleware bodyparser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//route usuario
app.use(require('../routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
  if(err) throw err;
  console.log('BASE DE DATOS ONLINE');
});

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto: ${process.env.PORT}`));
