const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");

// POST /auth/register
router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const result = await sql.query`
      SELECT * FROM usuarios WHERE email = ${email}
    `;

    if (result.recordset.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    await sql.query`
      INSERT INTO usuarios (nombre, email, password)
      VALUES (${nombre}, ${email}, ${password})
    `;

    res.json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql.query`
      SELECT * FROM usuarios WHERE email = ${email} AND password = ${password}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.json({ message: "Login exitoso", usuario: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

module.exports = router;
