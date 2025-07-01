const { isCelebrateError } = require("celebrate");

module.exports = (err, req, res, next) => {
  console.error("Error:", err.stack || err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (isCelebrateError(err)) {
    const bodyError = err.details.get("body");
    const message = bodyError
      ? bodyError.details.map((detail) => detail.message).join(", ")
      : "Error de validación en los datos enviados.";

    return res.status(400).json({
      message,
    });
  }

  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    message:
      statusCode === 500 ? "Se ha producido un error en el servidor" : message,
  });
};
