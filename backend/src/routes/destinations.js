const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");

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
