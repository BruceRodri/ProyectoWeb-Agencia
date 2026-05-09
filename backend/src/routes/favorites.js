const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");

// GET /favoritos/:usuario_id — obtener favoritos de un usuario
router.get("/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const result = await sql.query`
      SELECT d.* FROM destinos d
      INNER JOIN favoritos f ON d.id = f.destino_id
      WHERE f.usuario_id = ${usuario_id}
    `;
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// POST /favoritos — agregar favorito
router.post("/", async (req, res) => {
  const { usuario_id, destino_id } = req.body;

  try {
    const existe = await sql.query`
      SELECT * FROM favoritos 
      WHERE usuario_id = ${usuario_id} AND destino_id = ${destino_id}
    `;

    if (existe.recordset.length > 0) {
      return res.status(400).json({ error: "Ya está en favoritos" });
    }

    await sql.query`
      INSERT INTO favoritos (usuario_id, destino_id)
      VALUES (${usuario_id}, ${destino_id})
    `;

    res.json({ message: "Agregado a favoritos" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// DELETE /favoritos — eliminar favorito
router.delete("/", async (req, res) => {
  const { usuario_id, destino_id } = req.body;

  try {
    await sql.query`
      DELETE FROM favoritos 
      WHERE usuario_id = ${usuario_id} AND destino_id = ${destino_id}
    `;
    res.json({ message: "Eliminado de favoritos" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

module.exports = router;
