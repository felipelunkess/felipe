import sql from 'mssql';
import config from '../config/db.js';

export async function getResumo(req, res) {
  try {
    const pool = await sql.connect(config);

    // 👩‍🎓 Total de alunos
    const alunosResult = await pool.request().query('SELECT COUNT(*) AS total FROM aluno');

    // 📚 Total de cursos
    const cursosResult = await pool.request().query('SELECT COUNT(*) AS total FROM curso');

    // 🏫 Total de turmas
    const turmasResult = await pool.request().query('SELECT COUNT(*) AS total FROM turma');

    // 💰 Pagamentos por status
    const pagamentosResult = await pool.request().query(`
      SELECT status_pagamento, COUNT(*) AS total
      FROM pagamento
      GROUP BY status_pagamento
    `);

    // Extrai contagens
    let pendentes = 0, atrasados = 0, pagos = 0;

    pagamentosResult.recordset.forEach(p => {
      const status = p.status_pagamento.toLowerCase();
      if (status.includes('pendente')) pendentes += p.total;
      else if (status.includes('atras')) atrasados += p.total;
      else if (status.includes('pago')) pagos += p.total;
    });

    // Retorna o resumo
    res.json({
      alunos: alunosResult.recordset[0].total,
      cursos: cursosResult.recordset[0].total,
      turmas: turmasResult.recordset[0].total,
      pagamentos: { pendentes, atrasados, pagos },
    });

  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
  }
}
