const jwt = require("jsonwebtoken");

//ejecutar un funcion para la verificacion del token

// next : nos ejecutara todo el resto del codigo en donde pasemos el verificaToken
let verificaToken = (req, res, next) => {
  let token = req.get("token"); // obtendremos los header en donde estaran los token

  //verificaremos el token
  //decoded: es el payload ya desifrado
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido",
        },
      });
    }

    req.usuario = decoded.usuario; // payload
    next(); //para que el resto de la funcion se ejecute
  });
};

//verifica Admin Rol

let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.rol === "ADMIN_ROLE") {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador",
      },
    });
  }
};

//verificar tojken d ela imagenes y mostralas al usuario
let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido",
        },
      });
    }

    req.usuario = decoded.usuario; // payload
    next(); //para que el resto de la funcion se ejecute
  });
};

module.exports = {
  verificaToken,
  verificaAdmin_Role,
  verificaTokenImg,
};
