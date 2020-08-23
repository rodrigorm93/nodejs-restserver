const express = require("express");
const bcrypt = require("bcrypt");

//libreria para trbajar con los json
const jwt = require("jsonwebtoken");
const Usuario = require("../model/usuario");
const app = express();

//funciones para hacer la autentificacion
app.post("/login", (req, res) => {
  let body = req.body; //primero obtenemos el body, capturar el correo y el pass qwue el usario ingreso

  //peimero verificamos si el correo existe
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    //verificamos si llego un usuario de la bd si ese es el caso entonces los datos ingresados son validos

    if (!usuarioDB) {
      // si el usuario no existe
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contraseña incorrecto",
        },
      });
    }

    //ver si la constraseña ingresada es igual a la registrada en la BD
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contraseña incorrecto p",
        },
      });
    }

    let token = jwt.sign(
      {
        usuario: usuarioDB, //payload
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    ); //le daremos un nombre y el tiempo de expiracion, le diremos que expire en 30 dias

    res.json({
      ok: true,
      usuario: usuarioDB,
      token: token,
    });
  });
});

module.exports = app;
