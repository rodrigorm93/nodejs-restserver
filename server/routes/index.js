//colocaremos todas las rutas para poder utilizarlas
const express = require("express");
const app = express();

app.use(require("./usuario")); // para poder usar las rutas que estan en usuario
app.use(require("./login")); // para poder usar las rutas que estan en login
app.use(require("./categoria"));
app.use(require("./producto"));
module.exports = app;
