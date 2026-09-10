# Banco de Talentos — endpoint de envio

Este Worker recebe o formulário de `banco-de-talentos.html`, valida os campos e o currículo e envia a candidatura para `curriculos@mail.vulcandefense.com.br` usando o Cloudflare Email Service.

## Publicação

1. No painel Cloudflare, habilite **Email Service / Send Email** para `vulcandefense.com.br`.
2. Valide `curriculos@mail.vulcandefense.com.br` como destino e autorize `carreiras@vulcandefense.com.br` como remetente. O domínio remetente precisa estar cadastrado no Email Service.
3. Nesta pasta, instale as dependências com `npm install`.
4. Autentique o Wrangler e publique com `npm run deploy`.
5. Envie uma candidatura de teste pela página e confirme recebimento, anexo e resposta automática ao endereço informado.

O formulário usa a rota de mesmo domínio `/api/careers`; não é necessário expor uma origem CORS ampla. O código aceita apenas os dois domínios oficiais e ambientes locais de desenvolvimento.

## Segurança operacional

- Limite do currículo: 3 MB, somente PDF ou DOCX.
- Validação no navegador e repetida no Worker, incluindo assinatura básica do arquivo.
- Nome do arquivo normalizado e campos escapados antes de compor o e-mail.
- Nenhum conteúdo do currículo é registrado nos logs.
- Honeypot básico incluído. Antes de campanhas públicas, recomenda-se adicionar Cloudflare Turnstile e uma regra de rate limiting para `/api/careers`.
- A assinatura do arquivo é apenas uma primeira barreira. Para operação em escala, encaminhe anexos por uma etapa antimalware antes do acesso humano.
- Currículos são dados pessoais. Restrinja a caixa de destino, defina uma rotina interna de retenção e eliminação e mantenha o aviso da Política de Privacidade atualizado.
