# Segurança

## Headers

O arquivo `_headers` define HSTS, CSP, proteção contra clickjacking, política de referência, permissões de navegador e políticas de isolamento de recursos.

Ao incluir uma origem externa para scripts, estilos, imagens, conexões ou frames, revise a CSP de forma mínima e específica. Não use curingas ou permissões amplas sem justificativa.

## Carreiras

O Worker de carreiras limita currículos a 3 MB e aceita PDF ou DOCX, com validações no navegador e no servidor. O conteúdo do currículo não deve ser escrito em logs.

Antes de campanhas públicas, considere ativar Cloudflare Turnstile e rate limiting para `/api/careers`.

## Rotina recomendada

- Atualize dependências do Worker periodicamente.
- Revise regras de cache depois de mudanças em assets compartilhados.
- Teste formulários após cada publicação.
- Mantenha a Política de Privacidade alinhada aos dados coletados.
