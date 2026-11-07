# Portal protegido de downloads

Este Worker serve a cópia autenticada da central Business Products em `/business-products/portal/`. Os binários ficam em R2 privado e só são entregues após login; não copie os arquivos para `downloads/`, que é uma área pública do site.

## Preparação

1. Nesta pasta, execute `npm install`.
2. Crie o bucket privado `vulcan-private-downloads` no R2.
3. Gere os segredos sem expor a senha: `powershell -ExecutionPolicy Bypass -File ./scripts/new-portal-secrets.ps1`.
4. Grave cada valor exibido de forma interativa:
   - `wrangler secret put DOWNLOAD_PASSWORD_HASH`
   - `wrangler secret put SESSION_SECRET`
5. Troque `DOWNLOAD_USERNAME` em `wrangler.jsonc` pelo login que será entregue ao cliente.
6. Envie os binários: `npm run upload-packages -- -SourceDirectory "C:\Users\rafae\Documents\boticario\vulcan-agent\downloads"`.
7. Valide com `npm run dev` e publique com `npm run deploy`.

O Worker usa uma sessão assinada de oito horas, cookie `HttpOnly`/`Secure`/`SameSite=Strict`, PBKDF2 no lado do servidor e uma allowlist de seis objetos R2. Para criar credenciais individuais, substitua a autenticação por usuário único por um provedor de identidade ou tabela de usuários com hashes por conta antes de distribuir acesso a múltiplos clientes.
