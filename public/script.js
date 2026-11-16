async function gerarOK() {
    await executarRequisicao("/api/teste");
}

async function gerarErro() {
    await executarRequisicao("/api/erro");
}

async function executarRequisicao(rota) {
    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "Enviando requisição...";

    try {
        const resposta = await fetch(rota);

        if (resposta.ok) {
            mensagem.textContent = "Requisição executada com sucesso!";
        } else {
            mensagem.textContent = "Erro gerado na aplicação!";
        }

    } catch (error) {
        mensagem.textContent = "Não foi possível conectar ao servidor.";
    }
}
