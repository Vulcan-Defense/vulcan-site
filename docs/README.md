# Documentação do projeto Vulcan Defense

Este repositório contém o site institucional estático da Vulcan Defense, páginas de produto, materiais comerciais, downloads e o Worker de carreiras.

## Guias

- [Arquitetura e páginas](ARQUITETURA.md): estrutura do site, rotas, estilos e scripts.
- [Publicação e operação](PUBLICACAO.md): domínio, cache, headers e Worker de carreiras.
- [Conteúdo e manutenção](CONTEUDO.md): como atualizar páginas, materiais e downloads.
- [Segurança](SEGURANCA.md): controles aplicados e cuidados operacionais.

## Início rápido

O projeto não depende de uma etapa de build para as páginas estáticas. Abra `index.html` com um servidor HTTP local para testar links, scripts e políticas de segurança em condições próximas à produção.

Antes de publicar, valide os links alterados, teste os formulários envolvidos e revise as mudanças com `git diff --check`.

