# Arquitetura e páginas

## Visão geral

O site é composto por HTML estático, com estilos globais em `styles.css` e comportamento compartilhado em `site.js`. Recursos específicos de páginas ficam em `assets/`.

| Área | Arquivos principais | Finalidade |
|---|---|---|
| Institucional | `index.html`, `quem-somos.html`, `nosso-time.html`, `contato.html` | Apresentação, equipe e contato comercial. |
| Serviços | `servicos.html`, `cyber-defense.html`, `pentest-yellow-team-secops-dast.html`, `compliance-ia.html`, `security-champions.html`, `treinamentos-owasp-mitre.html` | Ofertas consultivas e capacitação. |
| Plataforma | `software-vulcan-platform.html`, `endpoint-protection-siem.html`, `siem-ot.html`, `siem-ot-setores.html` | Produtos Vulcan e soluções SIEM/OT. |
| Materiais | `portfolio-servicos*.html`, `relatorio-global.html`, `checklist-seguranca.html` | Material comercial, relatório e checklist. |
| Produtos auxiliares | `business-products/`, `downloads/` | Produtos e instaladores do agente. |
| Carreiras | `banco-de-talentos.html`, `assets/careers.*` | Formulário de candidatura e interface. |

## Arquivos compartilhados

- `styles.css`: tokens visuais, layout responsivo, navegação, formulário e rodapé.
- `site.js`: navegação responsiva, indicador de leitura, rodapé institucional e comportamentos inseridos em páginas comerciais.
- `assets/portfolio-commercial.css`: estilos do material comercial em português, inglês e espanhol.
- `assets/currency-switcher.js`: conversão de apresentação das tabelas comerciais por moeda.

## Páginas comerciais multilíngues

| Idioma | Arquivo | Moeda inicial |
|---|---|---|
| Português | `portfolio-servicos.html` | BRL |
| Inglês | `portfolio-servicos-en.html` | USD |
| Espanhol | `portfolio-servicos-es.html` | PEN, com regra comercial de 40% de desconto na apresentação |

As moedas exibidas são referências comerciais. Valores finais devem ser validados em proposta.

