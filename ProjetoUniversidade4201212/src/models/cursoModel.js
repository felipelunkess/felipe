const { sql, getPool } = require("../config/db");

async function listarCursosComDepartamento() {
  const result = await getPool().request().query(`
    SELECT c.*, d.descricao as departamento_nome
    FROM curso c
    JOIN departamento d ON c.id_departamento = d.id_departamento
    ORDER BY d.descricao, c.descricao
  `);
  return result.recordset;
}

async function criarCurso({
  id_departamento,
  descricao,
  sigla,
  valor_mensalidade,
  duracao_semestres,
}) {
  const result = await getPool()
    .request()
    .input("id_departamento", sql.Int, id_departamento)
    .input("descricao", sql.VarChar, descricao)
    .input("sigla", sql.VarChar, sigla)
    .input("valor_mensalidade", sql.Decimal(10, 2), valor_mensalidade)
    .input("duracao_semestres", sql.Int, duracao_semestres).query(`
      INSERT INTO curso (id_departamento, descricao, sigla, valor_mensalidade, duracao_semestres)
      OUTPUT INSERTED.*
      VALUES (@id_departamento, @descricao, @sigla, @valor_mensalidade, @duracao_semestres)
    `);
  return result.recordset[0];
}

async function atualizarCurso(
  id,
  { id_departamento, descricao, sigla, valor_mensalidade, duracao_semestres }
) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .input("id_departamento", sql.Int, id_departamento)
    .input("descricao", sql.VarChar, descricao)
    .input("sigla", sql.VarChar, sigla)
    .input("valor_mensalidade", sql.Decimal(10, 2), valor_mensalidade)
    .input("duracao_semestres", sql.Int, duracao_semestres).query(`
      UPDATE curso
      SET id_departamento = @id_departamento, descricao = @descricao, sigla = @sigla,
          valor_mensalidade = @valor_mensalidade, duracao_semestres = @duracao_semestres
      OUTPUT INSERTED.*
      WHERE id_curso = @id
    `);
  return result.recordset[0];
}

async function removerCurso(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM curso WHERE id_curso = @id");
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listarCursosComDepartamento,
  criarCurso,
  atualizarCurso,
  removerCurso,
};
