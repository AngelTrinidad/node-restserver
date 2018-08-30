//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//SEED de autenticacion
process.env.SEED_AUT = process.env.SEED_AUT || 'este-es-el-seed-desarrollo';

//Expiracion de token
process.env.EXP_TOKEN = process.env.EXP_TOKEN || '72h';

//Base de datos
let urlDB;
if(process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
}else{
  urlDB = 'mongodb://cafe_user:Angelt1!@ds133202.mlab.com:33202/cafe-node-angeltrinidad';
}
process.env.URLDB = urlDB;


process.env.CLIENT_ID = process.env.CLIENT_ID || '422297852295-g90rdfsc57b8l47p28ue57te5lgbeplu.apps.googleusercontent.com';
