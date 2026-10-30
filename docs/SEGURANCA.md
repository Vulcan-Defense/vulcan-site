# Segurança

Documento de referência da postura de segurança do site institucional (revisão de 2026-10-29).

## 1. Situação atual da hospedagem

O site é **estático (HTML/CSS/JS, sem build)** e hoje é publicado pelo **GitHub Pages**, com o domínio atrás do **Cloudflare**.

Isso tem duas consequências importantes:

1. **O arquivo `_headers` não é aplicado.** Ele é um formato suportado por Cloudflare Pages/Netlify, não pelo GitHub Pages. Verificado em produção: `https://vulcandefense.com.br/_headers` retorna 404 e nenhum header de segurança do arquivo chega ao navegador.
2. **Cada página carrega a CSP via `<meta http-equiv="Content-Security-Policy">`.** É o único mecanismo de CSP ativo em produção hoje.

Limitação conhecida: `frame-ancestors` (e `report-uri`) são **ignorados em meta tag** por especificação. Portanto, **proteção contra clickjacking só existe quando a CSP for enviada como header HTTP** (Cloudflare Pages ou Transform Rule no Cloudflare).

### Ações manuais necessárias no Cloudflare (fora do repositório)

| Item | Situação observada | Ação |
| --- | --- | --- |
| HSTS | Header malformado (`Securitymax-age=31536000; includeSubDomains; preload`) — HSTS é ignorado | Corrigir para `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` nas regras de resposta do Cloudflare |
| CSP | Nenhum header CSP em produção | Enviar a CSP do `_headers` como header (Transform Rule / Cloudflare Pages) |
| `X-Frame-Options` | Ausente | Enviar `DENY` (redundante com `frame-ancestors 'none'`, mas cobre navegadores antigos) |
| `X-Content-Type-Options` | Ausente | Enviar `nosniff` |
| `Referrer-Policy` | Ausente | Enviar `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Ausente | Enviar a política do `_headers` |
| `/.well-known/security.txt` | 404 | Publicar (arquivo já criado no repositório) |

Migrar a publicação para **Cloudflare Pages** resolve todos os itens de uma vez, pois o `_headers` passa a valer.

## 2. Política de segurança de conteúdo (CSP)

A CSP atual (`_headers` e meta tags) é restritiva:

```text
default-src 'self'; base-uri 'self'; form-action 'self' https://formspree.io;
object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self'; media-src 'self';
connect-src 'self' https://formspree.io; frame-src 'none';
worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests
```

Decisões e observações:

- **`script-src 'self'` sem `'unsafe-inline'`**: todo JavaScript foi externalizado para `assets/*.js` e não há handlers inline (`onclick` etc.). Blocos `application/ld+json` permanecem inline por serem dados, não código, e são permitidos pelo tipo MIME.
- **`style-src 'unsafe-inline'`**: necessário porque as páginas usam blocos e atributos `style` para layout específico. Pode ser removido no futuro extraindo esses estilos para CSS.
- **Fontes**: o Google Fonts foi removido (inclusive de `portfolio-servicos.html`); nenhuma página carrega fonte externa. A pilha usa fontes do sistema/auto-hospedadas.
- **Chart.js** é auto-hospedado em `assets/vendor/chart.umd.min.js` — não há dependência de CDN.
- **`relatorio-global.html`** tem CSP própria: libera os proxies de CORS usados para consultar a API pública do Ransomware.live e `frame-src` para o Power BI. É a página de maior superfície; mantenha os domínios na lista mínima.
- **Formulários** enviam para `formspree.io` (`form-action`/`connect-src`). Se o provedor mudar, atualize a CSP nas meta tags de **todas** as páginas e no `_headers`.

Ao adicionar qualquer recurso externo, altere a CSP de forma mínima e específica (sem `*`).

## 3. Controles implementados no código

- **Formulários**: validação de e-mail no cliente, `maxlength`, campos com `<label>` explícito, honeypot `_gotcha` invisível e mensagens via `role="status"`/`aria-busy`. O envio real depende do provedor (Formspree); nenhum dado é processado pelo site.
- **Links externos**: todos com `target="_blank"` usam `rel="noopener noreferrer"`, evitando acesso a `window.opener`.
- **Sem `eval`/`new Function` em código próprio.** O bundle de terceiros `html3pdf.bundle.min.js` contém um `Function(...)` dentro de `try/catch`; com `script-src 'self'` ele apenas falha silenciosamente, sem brecha.
- **Cookies/armazenamento**: o site **não define cookies**. O banner grava apenas `localStorage` (`vulcan-cookie-consent = 1|0`) para lembrar a escolha. Não há rastreamento ou publicidade.
- **Links administrativos**: nenhuma URL de painel/administração exposta no HTML.
- **Downloads**: instaladores e checksums em `downloads/` e `business-products/`; os arquivos `.sha256`/`.sha512` permitem verificação de integridade pelo usuário.
- **Redirecionamento**: `downloads/index.html` usa `meta refresh` (compatível com CSP), sem script inline.

## 4. CI/CD (`.github/workflows/snyk-security.yml`)

O pipeline foi endurecido:

- Jobs separados (`sast-sca` e `dast`) com `permissions: contents: read` e `timeout-minutes`.
- `actions/checkout` e `actions/upload-artifact` fixados por **SHA** e `persist-credentials: false`.
- Passos do Snyk só executam quando `SNYK_TOKEN` existe (antes o `snyk iac test` rodava sem CLI instalado e falhava de forma mascarada por `|| true`).
- DAST não roda em PRs de forks (não recebem secrets).
- Token do repositório privado de relatórios vai em **header HTTP**, não na URL do remote; relatório também é publicado como artifact.

Pendências recomendadas:

- Configurar `SNYK_TOKEN` e `GH_TOKEN` nos secrets do repositório.
- Fixar a imagem `ghcr.io/zaproxy/zaproxy` por digest em vez de `stable`.
- Ativar rate limiting/Turnstile no Worker de carreiras antes de campanhas públicas (ver abaixo).

## 5. Worker de carreiras (`deploy/careers-worker`)

- Limite de 3 MB por currículo, aceita apenas PDF/DOCX, validação no cliente e no servidor.
- Conteúdo do currículo não é gravado em logs.
- **Não há rate limiting.** Antes de campanhas públicas, adicione rate limiting no Cloudflare (WAF) e considere Turnstile em `/api/careers`.

## 6. Descoberta e transparência

- `robots.txt` aponta para `https://vulcandefense.com.br/sitemap.xml` — o arquivo agora existe no repositório.
- `.well-known/security.txt` criado (contato, política, idiomas, expiração em 2027-10-29). O arquivo `.nojekyll` é necessário para o GitHub Pages publicar esse diretório.
- Todas as páginas têm `<link rel="canonical">`; títulos e descrições revisados.

## 7. Checklist periódico

- [ ] Revisar `_headers` e a CSP ao adicionar qualquer domínio externo.
- [ ] Testar formulários após cada publicação.
- [ ] Rodar o pipeline de segurança e revisar os relatórios do ZAP.
- [ ] Atualizar dependências do Worker de carreiras.
- [ ] Revisar a Política de Privacidade quando mudar a coleta de dados.
- [ ] Revalidar headers em produção (`curl -sI https://vulcandefense.com.br`) após mudanças no Cloudflare.
