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

//GOOGLE CLIENT ID: sacado de la consola de credenciales
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "669370876013-j1c3oo9i1m3gm2u5rq2grd2c8737a9ll.apps.googleusercontent.com";
