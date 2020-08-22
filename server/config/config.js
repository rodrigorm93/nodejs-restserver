//vamos a declarar variables de forma global

//puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
//para saber si estamos en local o no
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//base de datos

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost/cafe";
} else {
  urlDB =
    "mongodb+srv://hathcock:LLRlcTXfwo4MkUx6@cluster0.vzclc.mongodb.net/cafe";
}

process.env.URLDB = urlDB;
