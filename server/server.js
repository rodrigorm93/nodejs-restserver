//cargar variables globales

require("./config/config");

const express = require("express");
const mongoose = require("mongoose"); //libreria de la base de datos
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/usuario")); // para poder usar las rutas que estan en usuario

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
