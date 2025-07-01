const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "mi-clave-super-secreta-y-segura" } = process.env;

// Controlador para obtener la información de los usuarios
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

// Controlador para obtener la información de un usuario específico por ID
module.exports.getUserById = (req, res, next) => {
  const { _id } = req.params;
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// Controlador para obtener la información del usuario actual
module.exports.getCurrentUser = (req, res, next) => {
  console.log("Usuario autenticado:", req.user);
  const userId = req.user._id;

  if (!userId) {
    return res
      .status(401)
      .send({ message: "No autorizado: no se encontró id de usuario" });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }
      res.status(200).send(user);
    })
    .catch(next);
};

// Controlador para crear un nuevo usuario
module.exports.newUser = (req, res, next) => {
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
    .catch(next);
};

// Controlador para actualizar la información de un usuario
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user; // Usar el ID del usuario autenticado

  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// Controlador para actualizar el avatar de un usuario
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// Controlador para buscar un usuario por sus credenciales
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
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
      next(err);
    });
};
