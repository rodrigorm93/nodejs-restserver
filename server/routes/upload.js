const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const Usuario = require("../model/usuario");
const Producto = require("../model/producto");

const fs = require("fs");
const path = require("path");

// default options
app.use(fileUpload({ useTempFiles: true }));

//lo queremos para actualizar ciertos datos
//tipo: nos dira si es una imagen de usuario o producto
//id: para saber que imagen de que usuario o producto actualizar
app.put("/upload/:tipo/:id", function (req, res) {
  //si no hay archivos entonces mandaremos un error

  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningún archivo",
      },
    });
  }

  //VALIDAR TIPO

  let tiposValidos = ["productos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Tipo no valida",
      },
    });
  }

  //asignar un archio a un registro

  //si mandamos un archivo lo recibiremos
  //archivo: es el nombre de la variable que almacena lo que mandamos
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split("."); // separamos el nombre d ela extension, separando lo que este entre los puntos

  let extension = nombreCortado[nombreCortado.length - 1];

  //EXTENCIONES PERMITIDAS

  let extensionesValidas = ["png", "jpg", "gif", "jpge"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Extension no valida",
      },
    });
  }

  //CAMBIAR NOMBRE DEL ARCHIVO

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  //le diremos donde mover el archivo

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });

    //aqui la imagen se cargar

    //ACTUALIZAMOS LA IMAGEN

    if (tipo === "usuarios") {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }

    //res.json({
    // ok: true,
    //message: "Imagen subida correctamente",
    //});
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "usuarios"); // si sucede un error igualmente la imagen se sube entonces la borramos
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, "usuarios"); // si sucede un error igualmente la imagen se sube entonces la borramos
      return res.status(400).json({
        ok: false,
        err: {
          message: "El usuario no existe",
        },
      });
    }

    borraArchivo(usuarioDB.img, "usuarios");

    //guardamos la nueva imagen en la BD usando su nombre
    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

//IMAGEN PRODUCTOS

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "productos"); // si sucede un error igualmente la imagen se sube entonces la borramos; productos=caprtea de upoload
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, "productos"); // si sucede un error igualmente la imagen se sube entonces la borramos
      return res.status(400).json({
        ok: false,
        err: {
          message: "El producto no existe",
        },
      });
    }

    borraArchivo(productoDB.img, "productos");

    //guardamos la nueva imagen en la BD usando su nombre
    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function borraArchivo(nombreImagen, tipo) {
  //para que no pueda ingresar la misma imagen dos veces
  //vereficamos que la ruta existe
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  //confirmar si ese path existe, si existe la borramos
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}
module.exports = app;
