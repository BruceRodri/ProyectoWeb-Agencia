const express = require("express");
const cors = require("cors");
const { conectar } = require("./config/db");
// IMPORTAR RUTAS
const destinosRouter = require("./routes/destinations");
const authRouter = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");
const reservasRouter = require("./routes/reservations");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/destinations", destinosRouter);
app.use("/auth", authRouter);
app.use("/favorites", favoritesRouter);
app.use("/reservations", reservasRouter);
// Iniciar servidor
conectar().then(() => {
  console.log("Rutas cargadas");
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
