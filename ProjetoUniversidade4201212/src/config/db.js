const sql = require("mssql");

// Configuração do banco de dados
const dbConfig = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "ProjetoUniversidadeWeb",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "123456",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function connectDB() {
  if (pool) {
    return pool;
  }
  pool = await sql.connect(dbConfig);
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error(
      "Pool de conexão não inicializado. Chame connectDB() antes."
    );
  }
  return pool;
}


module.exports = { sql, connectDB, getPool };
