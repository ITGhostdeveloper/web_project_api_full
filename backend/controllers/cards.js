const Card = require("../models/card");

// Controlador para obtener la información de las tarjetas
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para crear una nueva tarjeta
module.exports.newCard = (req, res) => {
  console.log("req.user en newCard:", req.user);
  console.log("Datos recibidos en el body:", req.body);
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Error de validación" });
      }
      next(err); // delega error a middleware global
    });
};

// Controlador para eliminar una tarjeta por ID
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new Error("NotFound"))
    .then((card) => {
      // Verificamos si el usuario autenticado es el dueño de la tarjeta
      if (card.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .send({ message: "No tienes permiso para eliminar esta tarjeta" });
      }

      // Autenticacion exitosa, procedemos a eliminar la tarjeta
      return Card.findByIdAndDelete(cardId).then(() => {
        res.status(200).send({ message: "Tarjeta eliminada correctamente" });
      });
    })
    .catch((err) => {
      console.error("Error en deleteCard:", err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "ID de tarjeta inválido" });
      }
      if (err.message === "NotFound") {
        return res
          .status(404)
          .send({ message: "La Tarjeta no ha sido encontrada" });
      }
      res.status(500).send({ message: "Error interno del servidor" });
    });
};

// Controlador para darle like a las tarjetas
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId, "ID de tarjeta en likeCard");
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "ID de tarjeta inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "La Tarjeta no ha sido encontrada" });
      }
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para quitar el like a las tarjetas
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "ID de tarjeta inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "La Tarjeta no ha sido encontrada" });
      }
      res.status(500).send({ message: "Error en el servidor" });
    });
};
