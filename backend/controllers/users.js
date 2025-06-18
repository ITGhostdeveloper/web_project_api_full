const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "clave-super-secreta";

// Controlador para obtener la información de los usuarios
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para obtener la información de un usuario específico por ID
module.exports.getUserById = (req, res) => {
  const { _id } = req.params;
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "ID de usuario inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para obtener la información del usuario actual
module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id; 

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para crear un nuevo usuario
module.exports.newUser = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Error de validación" });
      }
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para actualizar la información de un usuario
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.params;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Error de validación" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para actualizar el avatar de un usuario
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.params;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Error de validación" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.status(500).send({ message: "Error en el servidor" });
    });
};
// Controlador para buscar un usuario por sus credenciales
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: "7d",
      });

      res.status(200).send({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      console.error("Error en login:", err);
      res.status(401).send({ message: err.message });
    });
};
