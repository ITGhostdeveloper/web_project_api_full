const validator = require("validator");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Creando el esquema del usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jacques Cousteau", // Valor por defecto
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [30, "El nombre debe tener como máximo 30 caracteres"],
  },
  about: {
    type: String,
    minlength: [2, "La profesion debe tener al menos 2 caracteres"],
    maxlength: [30, "La profesion debe tener como máximo 30 caracteres"],
    default: "Explorador", // Rol por defecto
  },
  avatar: {
    type: String,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
    validate: {
      validator: function (v) {
        return validator.isURL(v, {
          require_protocol: true,
          require_valid_protocol: true,
          protocols: ["http", "https"],
        });
      },
      message: (props) => `${props.value} no es una URL válida!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} no es un correo electrónico válido!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [10, "la contraseña debe tener al menos 10 caracteres"],
  },
});

// Comprobacion de credenciales antes de guardar el usuario
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Usuario no encontrado"));
      }
      // Comparar la contraseña proporcionada con la almacenada
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Contraseña incorrecta"));
        }
        return user;
      });
    });
};

// Creando el modelo de usuario
module.exports = mongoose.model("User", userSchema);
