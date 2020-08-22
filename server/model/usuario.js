const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol valido",
};
//obtner el esquema de mongoose
let Schema = mongoose.Schema;

//definir el esquema

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"],
  },
  password: {
    type: String,
    required: [true, "la contraseña es obligatoria"],
  },

  img: {
    type: String,
    required: false,
  },
  rol: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos, //le asiganremos los roles que seran permitidos para registrarse
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

//funcion para eliminar la contraseña y no msotrala en consola
usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password; // para eliminar la contraseña

  return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} DEBE SER ÚNICO" }); //PARA ENVIAR MSJ CUANDO EXISTA UN DUPLICADO EN ESTE CASO DEL EMAIL

module.exports = mongoose.model("Usuario", usuarioSchema); //los exportamos y le damos un nombre al modelo que sera usuario
