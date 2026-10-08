# Conteúdo e manutenção

## Páginas e idiomas

Ao alterar o material comercial, mantenha as versões `portfolio-servicos.html`, `portfolio-servicos-en.html` e `portfolio-servicos-es.html` coerentes. Atualize textos, valores-base e avisos comerciais nas três versões.

## Ativos

- Imagens, scripts e CSS ficam em `assets/`.
- Instaladores e seus checksums ficam em `downloads/`.
- Depois de substituir um instalador, gere e publique também o arquivo `.sha512` correspondente.
- Não renomeie um asset referenciado por uma página sem atualizar todos os links.

## Formulários

- `contato.html` usa Formspree.
- `banco-de-talentos.html` envia para o endpoint do Worker de carreiras.

Ao atualizar um formulário, teste sucesso, erro, validação de campos e acessibilidade de mensagens.

## Conteúdo sensível

Evite colocar credenciais, chaves de API, dados pessoais ou informações de cliente no repositório. Propostas e valores devem incluir a ressalva de que são indicativos quando não forem uma oferta vinculante.

