const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const { PORT = 3000 } = process.env;
app.use(express.json());

// Conexión a la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/aroundb").then(() => {
  console.log("Conexión exitosa a la base de datos MongoDB");
});

// Importar controladores
const { login, newUser } = require("./controllers/users");

// Rutas publicas
app.post("/signin", login);
app.post("/signup", newUser);

// Middleware para la autenticación
const auth = require("./middlewares/auth");

app.use(auth);

// Rutas protegidas
const cardsRouter = require("./routes/cards");
app.use("/cards", cardsRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Ruta raiz
app.get("/", (req, res) => {
  res.send("El Servidor Express está funcionando!");
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Error interno del servidor" });
});

// Servidor en funcionamiento
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
