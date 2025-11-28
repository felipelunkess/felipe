const { sql, getPool } = require("../config/db");

async function listarDepartamentos() {
  const result = await getPool()
    .request()
    .query("SELECT * FROM departamento ORDER BY descricao");
  return result.recordset;
}

async function criarDepartamento({ descricao }) {
  const result = await getPool()
    .request()
    .input("descricao", sql.VarChar, descricao)
    .query(
      "INSERT INTO departamento (descricao) OUTPUT INSERTED.* VALUES (@descricao)"
    );
  return result.recordset[0];
}

async function atualizarDepartamento(id, { descricao }) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .input("descricao", sql.VarChar, descricao)
    .query(
      "UPDATE departamento SET descricao = @descricao OUTPUT INSERTED.* WHERE id_departamento = @id"
    );
  return result.recordset[0];
}

async function removerDepartamento(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM departamento WHERE id_departamento = @id");
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listarDepartamentos,
  criarDepartamento,
  atualizarDepartamento,
  removerDepartamento,
};
