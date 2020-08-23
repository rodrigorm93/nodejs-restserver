//vamos a declarar variables de forma global

//puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
//para saber si estamos en local o no
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//fecha de vencimiento
// 60 segundo, 60 minutos, 24 horas, 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//seed
//voy a declarar una variable en heroku que sera el seed de nuestra aplicacion
process.env.SEED = process.env.SEED || "secret-seed-aplication";

//base de datos

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
