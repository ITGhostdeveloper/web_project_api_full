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
router.post("/", newCard);

// Ruta para eliminar una tarjeta por ID
router.delete("/:_id", deleteCard);

// Ruta para darle like a una tarjeta
router.put("/likes/:_id", likeCard);

// Ruta para quitar el like a una tarjeta
router.delete("/likes/:_id", dislikeCard);

module.exports = router;
