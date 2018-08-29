const jwt = require('jsonwebtoken');

//Verificar token
//Si no se llama el next, entonces el procedimiento donde se utiliza, termina luego del middleware
let verificarToken = (req, res, next) => {

  let token = req.get('token');

  jwt.verify(token, process.env.SEED_AUT, (err, decoded) => {

    if(err){
      return res.status(401).json({
        ok: false,
        err
      });
    }

    req.usuario = decoded.usuario;

  });

  next();
};

let verificarRol = (req, res, next) => {
  if(req.usuario !== 'ADMIN_ROLE'){
    return res.status(401).json({
      ok: false,
      err: 'Rol no válido'
    });
  }

  next();
}

module.exports = {verificarToken,verificarRol};
