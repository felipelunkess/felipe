const { sql, getPool } = require("../config/db");

async function listarPagamentosDetalhados() {
  const result = await getPool().request().query(`
    SELECT p.*, m.id_aluno, a.nome as aluno_nome
    FROM pagamento p
    JOIN matricula m ON p.id_matricula = m.id_matricula
    JOIN aluno a ON m.id_aluno = a.id_aluno
    ORDER BY p.data_pagamento DESC
  `);
  return result.recordset;
}

async function criarPagamento({
  id_matricula,
  valor,
  tipo_pagamento,
  periodo_referencia,
  status,
}) {
  const result = await getPool()
    .request()
    .input("id_matricula", sql.Int, id_matricula)
    .input("valor", sql.Decimal(10, 2), valor)
    .input("tipo_pagamento", sql.VarChar, tipo_pagamento)
    .input("periodo_referencia", sql.VarChar, periodo_referencia)
    .input("status", sql.VarChar, status).query(`
      INSERT INTO pagamento (id_matricula, valor, tipo_pagamento, periodo_referencia, status)
      OUTPUT INSERTED.*
      VALUES (@id_matricula, @valor, @tipo_pagamento, @periodo_referencia, @status)
    `);
  return result.recordset[0];
}

async function atualizarPagamento(
  id,
  { id_matricula, valor, tipo_pagamento, periodo_referencia, status }
) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .input("id_matricula", sql.Int, id_matricula)
    .input("valor", sql.Decimal(10, 2), valor)
    .input("tipo_pagamento", sql.VarChar, tipo_pagamento)
    .input("periodo_referencia", sql.VarChar, periodo_referencia)
    .input("status", sql.VarChar, status).query(`
      UPDATE pagamento
      SET id_matricula = @id_matricula, valor = @valor, tipo_pagamento = @tipo_pagamento,
          periodo_referencia = @periodo_referencia, status = @status
      OUTPUT INSERTED.*
      WHERE id_pagamento = @id
    `);
  return result.recordset[0];
}

async function removerPagamento(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM pagamento WHERE id_pagamento = @id");
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listarPagamentosDetalhados,
  criarPagamento,
  atualizarPagamento,
  removerPagamento,
};
