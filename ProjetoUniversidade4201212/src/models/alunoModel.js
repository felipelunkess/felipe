const { sql, getPool } = require("../config/db");

async function listarAlunos() {
  const result = await getPool()
    .request()
    .query("SELECT * FROM aluno ORDER BY nome");
  return result.recordset;
}

async function criarAluno({ nome, cidade, estado, data_nascimento, status }) {
  const result = await getPool()
    .request()
    .input("nome", sql.VarChar, nome)
    .input("cidade", sql.VarChar, cidade)
    .input("estado", sql.VarChar, estado)
    .input("data_nascimento", sql.Date, data_nascimento)
    .input("status", sql.VarChar, status).query(`
      INSERT INTO aluno (nome, cidade, estado, data_nascimento, status)
      OUTPUT INSERTED.*
      VALUES (@nome, @cidade, @estado, @data_nascimento, @status)
    `);
  return result.recordset[0];
}

async function atualizarAluno(
  id,
  { nome, cidade, estado, data_nascimento, status }
) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .input("nome", sql.VarChar, nome)
    .input("cidade", sql.VarChar, cidade)
    .input("estado", sql.VarChar, estado)
    .input("data_nascimento", sql.Date, data_nascimento)
    .input("status", sql.VarChar, status).query(`
      UPDATE aluno
      SET nome = @nome, cidade = @cidade, estado = @estado, data_nascimento = @data_nascimento, status = @status
      OUTPUT INSERTED.*
      WHERE id_aluno = @id
    `);
  return result.recordset[0];
}

async function removerAluno(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM aluno WHERE id_aluno = @id");
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listarAlunos,
  criarAluno,
  atualizarAluno,
  removerAluno,
};
