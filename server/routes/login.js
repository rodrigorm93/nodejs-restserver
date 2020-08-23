const express = require("express");
const bcrypt = require("bcrypt");

//libreria para trbajar con los json
const jwt = require("jsonwebtoken");

//libreria de validaicon de token google
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID); //variable cread aen config

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

//configuraicones de GOOGLE

//le mandamos el token
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload(); //con el payload obtnenemos toda la informacion del usuario

  //retonamos los parametros, en la promesa
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

//ruta para hacer el login con google
app.post("/google", async (req, res) => {
  //reseviremos el token que envia google, y asi obtener el token mediante una peticion http
  //intalaremos : npm install google-auth-library --save , para validar el token.

  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  //una vez obtenido el usuario de google hay que registrarlo en l BD
  //primero hay que verificar que no exista un usuario con ese correo

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    //si existe el usuario en al base de datos, hay que revisdar si se ha autenticado por  goolgle
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        // si no se ha autenticado por google pero relizao el login con google nod ebe se rpermitido
        return res.status(400).json({
          ok: false,
          err: {
            message: "Debe de usar su autnetificacion normal",
          },
        });
      } else {
        // es un ausuario que si se autenticado con google, entonce hay que renovar su token para que peuda seguir trabajando

        let token = jwt.sign(
          {
            usuario: usuarioDB, //payload
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      //si el usaurio no existe ne la bd, creamos un nuevo usuario con esos datos

      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)"; // porque en esete caso el password no lo usaremos

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        //si todo sale bien regresamos el token

        let token = jwt.sign(
          {
            usuario: usuarioDB, //payload
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      });
    }
  });
});

module.exports = app;
