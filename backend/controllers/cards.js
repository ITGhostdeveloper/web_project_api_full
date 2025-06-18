const Card = require('../models/card');

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
  console.log(req.user._id);
  const { name, link, owner } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Error de validación" });
      }
      res.status(500).send({ message: "Error en el servidor" });
    });
};

// Controlador para eliminar una tarjeta por ID
module.exports.deleteCard = (req, res) => {
  const { _id } = req.params;
  Card.findByIdAndDelete(_id)
    .orFail(new Error("NotFound"))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      console.error("Error en deleteCard:", err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "ID de tarjeta inválido" });
      }
      if (err.message === "NotFound") {
        return res.status(404).send({ message: "La Tarjeta no ha sido encontrada" });
      }
      res.status(500).send({ message: "Error interno del servidor" });
    });
};

// controlador para darle like a las tarjetas
module.exports.likeCard = (req, res) => {
  const { _id } = req.params;
  Card.findByIdAndUpdate(
    _id,
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

// controlador para quitar el like a las tarjetas
module.exports.dislikeCard = (req, res) => {
  const { _id } = req.params;
  Card.findByIdAndUpdate(_id, { $pull: { likes: req.user._id } }, { new: true })
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
