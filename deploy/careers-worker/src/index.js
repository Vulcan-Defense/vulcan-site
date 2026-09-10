const RECIPIENT = "curriculos@mail.vulcandefense.com.br";
const SENDER = "carreiras@vulcandefense.com.br";
const MAX_FILE_BYTES = 3 * 1024 * 1024;
const MAX_REQUEST_BYTES = 4.2 * 1024 * 1024;
const ALLOWED_ORIGINS = new Set([
  "https://vulcandefense.com.br",
  "https://www.vulcandefense.com.br",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);
const ALLOWED_AREAS = new Set([
  "Cyber Defense e SOC",
  "Pentest e Segurança Ofensiva",
  "Engenharia de Software",
  "Dados, Automação e IA",
  "GRC, Privacidade e Compliance",
  "Produto, Comercial e Operações",
  "Estágio e início de carreira",
  "Outra área"
]);

function headersFor(request) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer"
  };
  const origin = request.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Accept, Content-Type";
  }
  return headers;
}

function json(request, data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: headersFor(request) });
}

function clean(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function safeFilename(name) {
  const normalized = String(name || "curriculo").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return normalized.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-120);
}

function toBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function validSignature(bytes, extension) {
  if (extension === "pdf") return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
  if (extension === "docx") return bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
  return false;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/careers") return json(request, { message: "Recurso não encontrado." }, 404);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headersFor(request) });
    if (request.method !== "POST") return json(request, { message: "Método não permitido." }, 405);

    const origin = request.headers.get("Origin");
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json(request, { message: "Origem não autorizada." }, 403);
    if (!(request.headers.get("Content-Type") || "").toLowerCase().startsWith("multipart/form-data")) return json(request, { message: "Formato da requisição inválido." }, 415);
    const declaredSize = Number(request.headers.get("Content-Length") || 0);
    if (declaredSize > MAX_REQUEST_BYTES) return json(request, { message: "Envio muito grande. O currículo deve ter até 3 MB." }, 413);

    const reference = crypto.randomUUID();
    let data;
    try {
      data = await request.formData();
    } catch {
      return json(request, { message: "Formulário multipart inválido.", reference }, 400);
    }

    try {
      if (clean(data.get("website"), 200)) return json(request, { ok: true, reference }, 202);

      const nome = clean(data.get("nome"), 120);
      const email = clean(data.get("email"), 254).toLowerCase();
      const telefone = clean(data.get("telefone"), 30);
      const localidade = clean(data.get("localidade"), 100);
      const area = clean(data.get("area"), 80);
      const linkedin = clean(data.get("linkedin"), 300);
      const mensagem = clean(data.get("mensagem"), 1500);
      const consentimento = data.get("consentimento");
      const curriculo = data.get("curriculo");

      if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ALLOWED_AREAS.has(area) || consentimento !== "accepted") {
        return json(request, { message: "Revise os campos obrigatórios e o consentimento." }, 400);
      }
      if (linkedin) {
        let profileUrl;
        try { profileUrl = new URL(linkedin); } catch { return json(request, { message: "Informe uma URL válida para LinkedIn ou portfólio." }, 400); }
        if (profileUrl.protocol !== "https:") return json(request, { message: "O link profissional deve usar HTTPS." }, 400);
      }
      if (!(curriculo instanceof File) || curriculo.size === 0 || curriculo.size > MAX_FILE_BYTES) {
        return json(request, { message: "Envie um currículo válido com até 3 MB." }, 400);
      }

      const extension = safeFilename(curriculo.name).toLowerCase().split(".").pop();
      if (extension !== "pdf" && extension !== "docx") return json(request, { message: "Formato não permitido. Envie PDF ou DOCX." }, 400);
      const fileBuffer = await curriculo.arrayBuffer();
      if (!validSignature(new Uint8Array(fileBuffer).subarray(0, 8), extension)) return json(request, { message: "O conteúdo do arquivo não corresponde ao formato informado." }, 400);

      const rows = [
        ["Nome", nome], ["E-mail", email], ["Telefone", telefone || "Não informado"],
        ["Localidade", localidade || "Não informada"], ["Área", area],
        ["LinkedIn / portfólio", linkedin || "Não informado"], ["Mensagem", mensagem || "Não informada"],
        ["Referência", reference]
      ];
      const htmlRows = rows.map(([label, value]) => `<tr><th style="padding:8px 12px;text-align:left;background:#f3f5f6">${escapeHtml(label)}</th><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`).join("");
      const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

      await env.EMAIL.send({
        from: { email: SENDER, name: "Vulcan Defense · Carreiras" },
        to: [{ email: RECIPIENT, name: "Banco de Talentos" }],
        replyTo: { email, name: nome },
        subject: `Banco de Talentos · ${nome}`,
        text,
        html: `<h2>Nova candidatura — Banco de Talentos</h2><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${htmlRows}</table><p style="font-family:Arial,sans-serif;font-size:12px;color:#667">Currículo anexado. Trate estes dados conforme a Política de Privacidade e limite o acesso ao processo seletivo.</p>`,
        attachments: [{
          filename: safeFilename(curriculo.name),
          type: extension === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          disposition: "attachment",
          content: toBase64(fileBuffer)
        }]
      });

      return json(request, { ok: true, reference }, 201);
    } catch (error) {
      console.error("careers_submission_failed", { reference, message: error instanceof Error ? error.message : "unknown" });
      return json(request, { message: "Não foi possível concluir o envio agora. Tente novamente mais tarde.", reference }, 500);
    }
  }
};
