const { celebrate } = require("celebrate");
const { updateAvatarSchema, updateUserSchema } = require("../utils/validator");
const express = require("express");
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

const router = express.Router();

// Ruta para obtener la información del usuario actual
router.get("/me", getCurrentUser);

// Ruta para actualizar la información del usuario actual
router.patch("/me", celebrate(updateUserSchema), updateUser);

// Ruta para actualizar el avatar del usuario actual
router.patch("/me/avatar", celebrate(updateAvatarSchema), updateAvatar);

// Ruta para obtener todos los usuarios
router.get("/", getUsers);

// Ruta para obtener la información de un usuario específico por ID
router.get("/:_id", getUserById);

module.exports = router;
