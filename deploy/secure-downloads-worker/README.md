# Portal protegido de downloads

Este Worker serve a cópia autenticada da central Business Products em `/business-products/portal/`. Os binários ficam em um repositório GitHub **privado** e só são entregues após login; não copie os arquivos para `downloads/`, que é uma área pública do site.

## Preparação

1. Nesta pasta, execute `npm install`.
2. Crie ou selecione um repositório GitHub privado para os binários, por exemplo `Vulcan-Defense/vulcan-agent-artifacts`. O repositório não pode ser público, pois arquivos públicos no GitHub ignoram a autenticação do portal.
3. Copie os seis binários para o clone local desse repositório: `npm run stage-artifacts -- -SourceDirectory "C:\Users\rafae\Documents\boticario\vulcan-agent\downloads" -PrivateRepositoryDirectory "C:\caminho\para\vulcan-agent-artifacts"`. Revise e execute `git add`, `git commit` e `git push` dentro do repositório privado.
4. Atualize `GITHUB_REPOSITORY` e `GITHUB_REF` em `wrangler.jsonc` se usar outro nome ou branch.
5. Gere os segredos sem expor a senha: `powershell -ExecutionPolicy Bypass -File ./scripts/new-portal-secrets.ps1`.
6. Grave cada valor exibido de forma interativa:
   - `wrangler secret put DOWNLOAD_PASSWORD_HASH`
   - `wrangler secret put SESSION_SECRET`
   - `wrangler secret put GITHUB_TOKEN` — token GitHub com permissão somente leitura de conteúdo no repositório privado.
7. Troque `DOWNLOAD_USERNAME` em `wrangler.jsonc` pelo login que será entregue ao cliente.
8. Valide com `npm run dev` e publique com `npm run deploy`.

O Worker usa uma sessão assinada de oito horas, cookie `HttpOnly`/`Secure`/`SameSite=Strict`, PBKDF2 no lado do servidor e uma allowlist de seis artefatos GitHub. Para criar credenciais individuais, substitua a autenticação por usuário único por um provedor de identidade ou tabela de usuários com hashes por conta antes de distribuir acesso a múltiplos clientes.
