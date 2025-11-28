const { sql, getPool } = require("../config/db");

async function listarMatriculasDetalhadas() {
  const result = await getPool().request().query(`
    SELECT m.*, a.nome as aluno_nome, t.periodo as turma_periodo, c.descricao as curso_nome
    FROM matricula m
    JOIN aluno a ON m.id_aluno = a.id_aluno
    JOIN turma t ON m.id_turma = t.id_turma
    JOIN curso c ON t.id_curso = c.id_curso
    ORDER BY m.data_matricula DESC
  `);
  return result.recordset;
}

async function criarMatricula({
  id_aluno,
  id_turma,
  status_matricula,
  observacoes,
}) {
  const result = await getPool()
    .request()
    .input("id_aluno", sql.Int, id_aluno)
    .input("id_turma", sql.Int, id_turma)
    .input("status_matricula", sql.VarChar, status_matricula)
    .input("observacoes", sql.Text, observacoes).query(`
      INSERT INTO matricula (id_aluno, id_turma, status_matricula, observacoes)
      OUTPUT INSERTED.*
      VALUES (@id_aluno, @id_turma, @status_matricula, @observacoes)
    `);
  return result.recordset[0];
}

async function atualizarMatricula(
  id,
  { id_aluno, id_turma, status_matricula, observacoes }
) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .input("id_aluno", sql.Int, id_aluno)
    .input("id_turma", sql.Int, id_turma)
    .input("status_matricula", sql.VarChar, status_matricula)
    .input("observacoes", sql.Text, observacoes).query(`
      UPDATE matricula
      SET id_aluno = @id_aluno, id_turma = @id_turma, status_matricula = @status_matricula, observacoes = @observacoes
      OUTPUT INSERTED.*
      WHERE id_matricula = @id
    `);
  return result.recordset[0];
}

async function removerMatricula(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM matricula WHERE id_matricula = @id");
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listarMatriculasDetalhadas,
  criarMatricula,
  atualizarMatricula,
  removerMatricula,
};
