//colocaremos todas las rutas para poder utilizarlas
const express = require("express");
const app = express();

app.use(require("./usuario")); // para poder usar las rutas que estan en usuario
app.use(require("./login")); // para poder usar las rutas que estan en login
app.use(require("./categoria"));
app.use(require("./producto"));
app.use(require("./upload"));
app.use(require("./imagenes"));
module.exports = app;
