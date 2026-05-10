const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");
// GET /destinos/recomendados?tipo=playa&presupuesto=bajo&clima=cálido
router.get("/recomendados", async (req, res) => {
  const { tipo, presupuesto, clima } = req.query;

  try {
    const result = await sql.query`
      SELECT TOP 3 * FROM destinos
      WHERE tipo = ${tipo}
      OR presupuesto = ${presupuesto}
      OR clima = ${clima}
      ORDER BY 
        CASE 
          WHEN tipo = ${tipo} AND presupuesto = ${presupuesto} AND clima = ${clima} THEN 1
          WHEN tipo = ${tipo} AND presupuesto = ${presupuesto} THEN 2
          WHEN tipo = ${tipo} THEN 3
          ELSE 4
        END
    `;
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
});
// GET /destinos — obtener todos los destinos
router.get("/", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM destinos");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener destinos" });
  }
});
module.exports = router;
