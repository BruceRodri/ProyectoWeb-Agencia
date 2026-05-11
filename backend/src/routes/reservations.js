const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");

// POST /reservas — crear reserva ACTUALIZADO
router.post("/", async (req, res) => {
  const {
    usuario_id,
    destino_id,
    fecha_entrada,
    fecha_salida,
    personas,
    tipo_habitacion,
    total_pago, // NUEVO
    metodo_pago, // NUEVO
  } = req.body;

  try {
    // ASEGÚRATE DE INCLUIR LOS NUEVOS CAMPOS EN EL INSERT
    await sql.query`
      INSERT INTO reservas (usuario_id, destino_id, fecha_entrada, fecha_salida, personas, tipo_habitacion, total_pago, metodo_pago)
      VALUES (${usuario_id}, ${destino_id}, ${fecha_entrada}, ${fecha_salida}, ${personas}, ${tipo_habitacion},  ${total_pago}, ${metodo_pago})
    `;
    res.json({ message: "RESERVA REALIZADA Y REGISTRADA CORRECTAMENTE" });
  } catch (error) {
    console.error("ERROR AL REALIZAR LA RESERVA:", error);
    res
      .status(500)
      .json({ error: "ERROR AL REALIZAR LA RESERVA EN EL SERVIDOR" });
  }
});

// GET /reservas/:usuario_id — obtener reservas de un usuario
router.get("/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const result = await sql.query`
      SELECT r.*, d.nombre, d.pais, d.imagen, d.tipo
      FROM reservas r
      INNER JOIN destinos d ON r.destino_id = d.id
      WHERE r.usuario_id = ${usuario_id}
      ORDER BY r.fecha_reserva DESC
    `;
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

module.exports = router;
