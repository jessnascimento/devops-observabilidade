# Observabilidade de aplicação web

Projeto acadêmico para demonstrar a observabilidade de uma aplicação web: uma interface simples envia requisições a um backend Node.js e Express, que pode ser instrumentado com OpenTelemetry e integrado ao Grafana Cloud. A infraestrutura AWS e a configuração do coletor utilizado no ECS estão no repositório [devops-infra-observabilidade](https://github.com/jessnascimento/devops-infra-observabilidade).

## Objetivo

Explorar como requisições bem-sucedidas, erros e lentidão aparecem nos dados de observabilidade, apoiando o acompanhamento da saúde e do desempenho da aplicação. No Grafana Cloud, dashboards podem apresentar indicadores como taxa de requisições, proporção de erros 5xx, proporção de sucesso e latência p95, desde que os sinais e consultas correspondentes estejam configurados.

## Como funciona

A interface HTML, CSS e JavaScript oferece botões para gerar uma requisição bem-sucedida ou um erro. O Express serve a interface e responde às rotas da API. O processo Node.js é iniciado com a instrumentação automática do OpenTelemetry.

Na infraestrutura de destino, a aplicação e o Grafana Alloy compartilham uma tarefa ECS Fargate. A aplicação envia dados via OTLP HTTP ao Alloy, que os encaminha ao Grafana Cloud. O Alloy está configurado para receber métricas, logs e traces; a presença de cada sinal depende da instrumentação e da configuração do destino. As chamadas `console` das rotas não garantem, sozinhas, a exportação de logs.

```text
Navegador → Route 53 / ALB → Aplicação Express no ECS
                                  │ OTLP
                                  ▼
                             Grafana Alloy → Grafana Cloud
```

## Tecnologias

HTML, CSS e JavaScript compõem a interface; Node.js e Express implementam o servidor; OpenTelemetry fornece instrumentação; Docker empacota a aplicação. Amazon ECR, ECS Fargate, Grafana Alloy e Grafana Cloud compõem o ambiente de execução e observabilidade.

## Executar localmente

É necessário Node.js compatível com o projeto; a imagem Docker usa Node.js 22. Na raiz do repositório:

```bash
npm ci
npm start
```

Acesse `http://localhost:3000`. Defina a variável `PORT` para usar outra porta. `npm run dev` inicia o servidor com `--watch` e carrega `.env.app`; revise esse arquivo antes de usá-lo e não inclua credenciais no repositório.

A aplicação pode ser executada sem configurar o Grafana para testar as rotas. Para exportar telemetria localmente, configure um coletor OTLP e as variáveis OpenTelemetry apropriadas, por exemplo `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT` e `OTEL_EXPORTER_OTLP_PROTOCOL`. O repositório contém um exemplo de configuração Alloy em `config.alloy`; a configuração usada pela infraestrutura ECS é mantida no repositório de infraestrutura.

## Rotas de teste

| Método e rota | Comportamento |
| --- | --- |
| `GET /` | Exibe a interface web |
| `GET /api/teste` | Retorna HTTP 200 e registra uma mensagem de sucesso |
| `GET /api/erro` | Retorna HTTP 500 e registra um erro simulado |
| `GET /api/lento` | Retorna HTTP 200 após aproximadamente quatro segundos |
| `GET /api/health` | Retorna HTTP 200 com o estado da aplicação |

Exemplo: `curl -i http://localhost:3000/api/erro`. As rotas de erro e lentidão existem para gerar cenários de teste.

## Docker e publicação

```bash
docker build -t devops-observabilidade .
docker run --rm -p 3000:3000 devops-observabilidade
```

O workflow do GitHub Actions é executado em pushes para `main` ou manualmente. Ele usa a variável `AWS_ROLE_ARN` e autenticação OIDC para construir e publicar a imagem `latest` no repositório ECR `projeto-observabilidade-app`, em `us-east-1`. A publicação da imagem não força uma nova implantação do serviço ECS; uma atualização do serviço pode ser necessária para executar a imagem nova.

## Estrutura

```text
public/                 Interface web
src/server.js           Servidor Express
src/routes/             Rotas de teste e saúde
Dockerfile              Imagem da aplicação
config.alloy            Exemplo de configuração do Alloy
.github/workflows/      Publicação da imagem no ECR
```

## Autores

Jessica, Felipe, Ravi Leal, Rayane Silva, Victor Oliveira e Victor Emery.
