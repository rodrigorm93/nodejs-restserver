//no pediremos permisos de admistrador
const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

let app = express();

let Producto = require("../model/producto");

app.get("/productos", verificaToken, (req, res) => {
  //traer todos los productos con el usuario y la categoria y paginados

  let desde = req.query.desde || 0;
  desde = Number(desde);

  //mostrara todos los producto que esten disponibles
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// ===========================
//  Obtener un producto por ID
// ===========================
app.get("/productos/:id", (req, res) => {
  // populate: usuario categoria
  // paginado
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "ID no existe",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

//Buscar productos

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino; // resibimos el termino

  //para hacer la busqueda mas general se mandara una expresion general
  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// ===========================
//  Crear un nuevo producto
// ===========================
app.post("/productos", verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado

  let body = req.body;

  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
});

// ===========================
//  Actualizar un producto
// ===========================
app.put("/productos/:id", verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado

  let id = req.params.id;
  let body = req.body;

  //primero buscamos los productos con ese ID

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no existe",
        },
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado,
      });
    });
  });
});

// ===========================
//  Borrar un producto
// ===========================
app.delete("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "ID no existe",
        },
      });
    }

    productoDB.disponible = false;

    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        mensaje: "Producto borrado",
      });
    });
  });
});

module.exports = app;
