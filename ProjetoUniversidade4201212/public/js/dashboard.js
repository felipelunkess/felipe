document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/dashboard");
    if (!res.ok) throw new Error("Erro ao buscar dados da API");

    const data = await res.json();
    console.log("📊 Dados recebidos do backend:", data);

    // Atualiza os elementos do dashboard com os dados vindos do backend
    document.getElementById("total-alunos").textContent = data.alunos ?? 0;
    document.getElementById("total-cursos").textContent = data.cursos ?? 0;
    document.getElementById("total-turmas").textContent = data.turmas ?? 0;

    // Verifica se o objeto pagamentos existe antes de acessar
    if (data.pagamentos) {
      document.getElementById("pag-pendentes").textContent =
        data.pagamentos.pendentes ?? 0;
      document.getElementById("pag-atrasados").textContent =
        data.pagamentos.atrasados ?? 0;
      document.getElementById("pag-pagos").textContent =
        data.pagamentos.pagos ?? 0;
    } else {
      console.warn("⚠️ Dados de pagamentos não encontrados.");
    }
  } catch (error) {
    console.error("❌ Erro ao carregar dashboard:", error);
  }
});
