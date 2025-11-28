const express = require("express");
const router = express.Router();
const { getPool } = require("../config/db");

// Rota principal do dashboard
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    // Contagem de alunos
    const alunos = await pool.request().query("SELECT COUNT(*) AS total FROM aluno");
    // Contagem de cursos
    const cursos = await pool.request().query("SELECT COUNT(*) AS total FROM curso");
    // Contagem de turmas
    const turmas = await pool.request().query("SELECT COUNT(*) AS total FROM turma");

    // Pagamentos por status
    const pendentes = await pool.request().query(
      "SELECT COUNT(*) AS total FROM pagamento WHERE status = 'pendente'"
    );
    const atrasados = await pool.request().query(
      "SELECT COUNT(*) AS total FROM pagamento WHERE status = 'atrasado'"
    );
    const pagos = await pool.request().query(
      "SELECT COUNT(*) AS total FROM pagamento WHERE status = 'pago'"
    );

    res.json({
      alunos: alunos.recordset[0].total,
      cursos: cursos.recordset[0].total,
      turmas: turmas.recordset[0].total,
      pagamentos: {
        pendentes: pendentes.recordset[0].total,
        atrasados: atrasados.recordset[0].total,
        pagos: pagos.recordset[0].total,
      },
    });
  } catch (err) {
    console.error("❌ Erro no dashboard:", err);
    res.status(500).json({ error: "Erro ao carregar dados do dashboard" });
  }
});

module.exports = router;
