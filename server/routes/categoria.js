const express = require("express");

let {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../model/categoria");
app.get("/categoria", verificaToken, (req, res) => {
  //buscamos todas las categorias
  //populate() :va revisar que id existen en la categoria que estoy solicitando, y va permitir cargar informaicion
  //es decir conectara las tablas, y en el segundo campo indicamos lo que queremos cargar de la otra tabla
  Categoria.find({})
    .sort("descripcion") //para que ordene por la descripcion
    .populate("usuario", "nombre email")
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias,
      });
    });
});

//mostrar por ID
app.get("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "El ID no es valido",
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ============================
// Crear nueva categoria
// ============================
app.post("/categoria", verificaToken, (req, res) => {
  // regresa la nueva categoria
  // req.usuario._id
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

///Actualizar una categoria

app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion,
  };

  // runValidators: true : para activar las validaciones que tenemos configuradas en el modelo por ejemplo en que no puede
  //cambiar el rol dsitinto a los definidos en el modelo

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      //si la categoria no existe tirara un error
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

//eliminar una categoria
//para eliminar tendremso que verificar el token y si es un admin
app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      //si la categoria no existe tirara un error
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El id no existe",
          },
        });
      }

      res.json({
        ok: true,
        message: "Categoria Borrada",
      });
    });
  }
);

module.exports = app;
