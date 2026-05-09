const sql = require('mssql')
require('dotenv').config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

async function conectar() {
  try {
    await sql.connect(config)
    console.log('Conectado a SQL Server')
  } catch (error) {
    console.error('Error de conexión:', error)
  }
}

module.exports = { sql, conectar }