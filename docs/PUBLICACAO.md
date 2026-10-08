# Publicação e operação

## Domínio e hospedagem

O arquivo `CNAME` configura `vulcandefense.com.br`. A configuração `_headers` é compatível com Cloudflare Pages e Netlify.

O site é estático: publique o conteúdo do diretório raiz do projeto. Arquivos HTML recebem política de não cache; ativos em `assets/` usam cache longo e imutável. Ao alterar um asset compartilhado, adicione versionamento na URL ou ajuste a política de cache para que visitantes recebam a versão nova.

## Checklist de publicação

1. Rode `git diff --check`.
2. Teste páginas e links modificados em ambiente HTTP local.
3. Confirme formulários e links externos.
4. Publique o diretório raiz no provedor configurado.
5. Abra a URL pública com um parâmetro de versão para verificar cache, por exemplo `?v=YYYYMMDD`.

## Worker de carreiras

O Worker está em `deploy/careers-worker/` e atende `/api/careers` nos domínios principal, `www` e `portifolio`.

Use o diretório do Worker para instalar dependências e publicar:

```text
npm install
npm run deploy
```

O Worker depende da configuração Cloudflare Email Service descrita em `deploy/careers-worker/README.md`.

