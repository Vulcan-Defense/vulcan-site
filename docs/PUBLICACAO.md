# Publicação e operação

## Domínio e hospedagem

O arquivo `CNAME` configura `vulcandefense.com.br`. A configuração `_headers` é compatível com Cloudflare Pages e Netlify.

> **Atenção:** o site está publicado no GitHub Pages, que **ignora** o `_headers`. Em produção, os headers de segurança listados nesse arquivo não são enviados. A CSP ativa hoje vem das meta tags de cada página; proteção contra clickjacking (`frame-ancestors`) exige header HTTP. Para valer o `_headers`, publique via **Cloudflare Pages** ou replique os headers em uma **Transform Rule** no Cloudflare. Detalhes em [`docs/SEGURANCA.md`](SEGURANCA.md).

O site é estático: publique o conteúdo do diretório raiz do projeto. Arquivos HTML recebem política de não cache; ativos em `assets/` usam cache longo e imutável. Ao alterar um asset compartilhado, adicione versionamento na URL ou ajuste a política de cache para que visitantes recebam a versão nova.

## SEO e descoberta

- `sitemap.xml` na raiz (referenciado pelo `robots.txt`).
- `.well-known/security.txt` para contato de segurança.
- `.nojekyll` na raiz: sem ele o GitHub Pages (Jekyll) não publica diretórios que começam com ponto, como `.well-known`.
- Cada página tem `<link rel="canonical">` e exatamente um `<h1>`.

## Checklist de publicação

1. Rode `git diff --check`.
2. Teste páginas e links modificados em ambiente HTTP local.
3. Confirme formulários e links externos.
4. Valide `sitemap.xml`, `robots.txt` e `.well-known/security.txt`.
5. Publique o diretório raiz no provedor configurado.
6. Abra a URL pública com um parâmetro de versão para verificar cache, por exemplo `?v=YYYYMMDD`.
7. Confira os headers de resposta: `curl -sI https://vulcandefense.com.br`.

## Worker de carreiras

O Worker está em `deploy/careers-worker/` e atende `/api/careers` nos domínios principal, `www` e `portifolio`.

Use o diretório do Worker para instalar dependências e publicar:

```text
npm install
npm run deploy
```

O Worker depende da configuração Cloudflare Email Service descrita em `deploy/careers-worker/README.md`.

