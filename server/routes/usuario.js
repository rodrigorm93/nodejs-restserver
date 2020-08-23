const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../model/usuario");

const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");

//put: para actualizar data
//post: para crear nuevos registros

// el segundo argumento de seria el middlewere
app.get("/usuario", verificaToken, (req, res) => {
  let desde = req.query.desde || 0; //para decirle desde que pagina empezar a mostrar los datos

  desde = Number(desde);

  let limite = req.query.limite || 5; // el limite d epaginas por pagina
  limite = Number(limite);

  //con estado:true en el fin le diremos que muestre solo los del estado activo

  Usuario.find({ estado: true }, "nombre email rol estado google img") // para que regrese todos los datos, podemos tambien especificar que campos queremos que mande
    .skip(desde) //para lograr una paginacion mostrando los registros de 5 en 5
    .limit(limite) //le diremos que queremos solo 5 registros
    .exec((err, usuarios) => {
      //nos devuelve un error y una lista de usuarios

      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.count({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios: usuarios,
          cuantos: conteo,
        });
      }); //para saber el numero de registros que existen
    });
});

app.post("/usuario", [verificaToken, verificaAdmin_Role], function (req, res) {
  let body = req.body; //es el que va aparecer cuando bodyParser pase por la peticiones

  //creamos un nuevo objeto de tipo usuario
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    rol: body.rol,
  });

  usuario.save((err, usuarioDB) => {
    //si ocurre un error
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    //usuarioDB.password = null; //para que no mandemos el password por consola

    //si todo sale bien mandaremos el usuario
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuario/:id", [verificaToken, verificaAdmin_Role], function (
  req,
  res
) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]); //le diremos que campos se podran actualizar con: underscore . utilizaremos pick

  //realizamos la actualizacion.
  //buscaremso el id y lo actualizaremos
  //le pasamos el id, el body, recive un error y el usuario de la base de datos
  // runValidators: true : para activar las validaciones que tenmos configuradas en el modelo por ejemplo en que no puede
  //cambiar el rol dsitinto a los definidos en el modelo

  //para manejar mejor las validaciones y evistar que el usuario actualice campos que no esten permitidos vamos a utilizar
  // npm install underscore . utilizaremos pick

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

//metodo para eliminar

app.delete("/usuario/:id", [verificaToken, verificaAdmin_Role], function (
  req,
  res
) {
  let id = req.params.id;

  let cambiaEstado = {
    estado: false,
  };

  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado, // lemandmos un objeto para hacer el cambio
    { new: true }, // creamos u nuevo regiustro ya cambiado
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!usuarioBorrado) {
        //si el usuario no existe nos mandara un msj de error
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario no encontrado",
          },
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );

  /*
  //para borrar el registro fisicamente
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

     
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!usuarioBorrado) {
      //si el usuario no existe nos mandara un msj de error
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado",
        },
      });
    }
  
    res.json({
      ok: true,
      usuario: usuarioBorrado,
    });
  });
      */
});

//vamos a exportar el app para poder usar todas las peticiones de este js

module.exports = app;
