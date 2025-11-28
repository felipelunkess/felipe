const { connectDB, getPool } = require("./config/db");

async function runDiagnostics() {
  try {
    // 1️⃣ Conectar ao banco
    console.log("🔹 Tentando conectar ao banco de dados...");
    await connectDB();
    const pool = getPool();
    console.log("✅ Conexão estabelecida com sucesso!");

    // 2️⃣ Testar leitura da tabela professor
    console.log("🔹 Tentando ler registros da tabela 'professor'...");
    const readResult = await pool.request().query("SELECT TOP 5 * FROM professor");
    console.log("✅ Registros encontrados:", readResult.recordset);

    // 3️⃣ Testar inserção de professor de teste
    console.log("🔹 Tentando inserir professor de teste...");
    const testName = "Teste Node";
    const testDeptId = null; // use 1 se tiver algum departamento
    const testStatus = "ativo";

    const insertResult = await pool.request()
      .input("nome", testName)
      .input("id_departamento", testDeptId)
      .input("status", testStatus)
      .query(`
        INSERT INTO professor (nome, id_departamento, status)
        VALUES (@nome, @id_departamento, @status);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const insertedId = insertResult.recordset[0].id;
    console.log("✅ Professor inserido com sucesso! ID:", insertedId);

    // 4️⃣ Testar exclusão do professor de teste
    console.log("🔹 Tentando excluir professor de teste...");
    await pool.request()
      .input("id", insertedId)
      .query("DELETE FROM professor WHERE id = @id");
    console.log("✅ Professor de teste excluído com sucesso!");

    console.log("🎉 Todos os testes concluídos com sucesso!");
  } catch (err) {
    console.error("❌ Erro encontrado durante o diagnóstico:", err);
  }
}

runDiagnostics();
