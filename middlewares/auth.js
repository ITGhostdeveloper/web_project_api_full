const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(403)
      .send({ message: 'Acceso prohibido. No estás autorizado.' });
  }

  // Extraemos el token de autorization con replace()
  const token = authorization.replace('Bearer ', '');

  try {
    // Verificamos el JWT con el metodo verify()
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload; // Guardar el payload en el request para usarlo después
    next();
  } catch (err) {
    return res
      .status(403)
      .send({ message: 'Tu token no es válido o ha expirado.' });
  }
};
