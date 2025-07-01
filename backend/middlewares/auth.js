const jwt = require("jsonwebtoken");
const { JWT_SECRET = "mi-clave-super-secreta-y-segura" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("Token recibido en el backend:", authorization);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(403)
      .send({ message: "Acceso prohibido. No estás autorizado." });
  }

  // Extraemos el token de autorization con replace()
  const token = authorization.replace("Bearer ", "");
  try {
    // Verificamos el JWT con el metodo verify()
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Guardar el payload en el request para usarlo después
    console.log("Usuario autenticado:", payload);
    next();
  } catch (err) {
    return res
      .status(403)
      .send({ message: "Tu token no es válido o ha expirado." });
  }
};
