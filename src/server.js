const express = require("express");
const path = require("path");

const monitoramentoRoutes = require("./routes/monitoramento");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite receber JSON
app.use(express.json());

// Disponibiliza os arquivos do frontend
app.use(express.static(path.join(__dirname, "../public")));

// Disponibiliza as rotas de monitoramento
app.use("/api", monitoramentoRoutes);

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor executando na porta ${PORT}`);
});
