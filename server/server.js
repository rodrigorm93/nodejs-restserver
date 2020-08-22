//cargar variables globales

require("./config/config");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//put: para actualizar data
//post: para crear nuevos registros

app.get("/usuario", function (req, res) {
  //res.send("Hello World");
  //se trabajara enviando informacion en formato JSON
  res.json("get usuario");
});

app.post("/usuario", function (req, res) {
  let body = req.body; //es el que va aparecer cuando bodyParser pase por la peticiones
  res.json(body);
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;
  res.json({
    id,
  });
});

app.delete("/usuario", function (req, res) {
  res.json("delete usuario");
});

app.listen(process.env.PORT, () => {
  console.log("Escuchando en el puero", process.env.PORT);
});
