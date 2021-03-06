//cargar variables globales

require("./config/config");

const express = require("express");
const mongoose = require("mongoose"); //libreria de la base de datos
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//HABILITAR LA CARPETA PUBLIC PARA QUE SE PUEDA ACCEDER DE CUALQUIER LUGAR
//habilitar middlere

app.use(express.static(path.resolve(__dirname, "../public")));

//configuracion fglobal de rutas
app.use(require("./routes/index.js")); // para llamar al index.js que tiene todoas las rutas

//conexion de la base de datos

const connectDB = async () => {
  await mongoose.connect(process.env.URLDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  console.log("DB is connect");
};

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Escuchando en el puero", process.env.PORT);
});
