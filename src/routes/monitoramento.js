const express = require("express");

const router = express.Router();

// Rota de teste: resposta normal
router.get("/teste", (req, res) => {
    console.log("Requisição de teste realizada");

    res.status(200).json({
        status: "sucesso",
        mensagem: "Aplicação funcionando corretamente!"
    });
});

// Rota para simular um erro
router.get("/erro", (req, res) => {
    console.error("Erro simulado na aplicação");

    res.status(500).json({
        status: "erro",
        mensagem: "Erro interno simulado!"
    });
});

// Rota para simular lentidão
router.get("/lento", (req, res) => {
    console.warn("Requisição lenta iniciada");

    setTimeout(() => {
        res.status(200).json({
            status: "sucesso",
            mensagem: "Requisição concluída após atraso!"
        });
    }, 4000);
});

// Rota de saúde da aplicação
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "online",
        mensagem: "Aplicação saudável!"
    });
});

module.exports = router;
