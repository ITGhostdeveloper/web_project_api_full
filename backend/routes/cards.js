const { celebrate } = require("celebrate");
const { createCardSchema } = require("../utils/validator");
const express = require("express");
const {
  getCards,
  newCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const router = express.Router();

// Ruta para obtener la información de las tarjetas
router.get("/", getCards);

// Ruta para crear una nueva tarjeta
router.post("/", celebrate(createCardSchema), newCard);

// Ruta para eliminar una tarjeta por ID
router.delete("/:cardId", deleteCard);

// Ruta para darle like a una tarjeta
router.put("/:cardId/likes", likeCard);

// Ruta para quitar el like a una tarjeta
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
