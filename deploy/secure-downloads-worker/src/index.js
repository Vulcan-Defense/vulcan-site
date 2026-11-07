const PORTAL_PATH = "/business-products/portal";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

const PACKAGES = Object.freeze([
  { id: "windows-client", name: "Vulcan Agent para Windows", platform: "Windows cliente · x86 / WOW64", filename: "vulcan-agent-windows.msi", key: "windows/vulcan-agent-windows.msi", size: "11,9 MB", sha512: "eec9124daa7555d3b59004671ff53c82fe2cc0a699a1a562cdba2f1134f136d6b55afadc04a507207dd7ca6ef4270714d48935478bebd2598892fa53ea3e6e9e", contentType: "application/octet-stream" },
  { id: "windows-server", name: "Vulcan Agent para Windows Server", platform: "Windows Server · x64", filename: "vulcan-agent-windows-server-x64.msi", key: "windows/vulcan-agent-windows-server-x64.msi", size: "11,9 MB", sha512: "295409d4f15e2cac8d632719166dc02cd7d2391e44ecdb53c7f775ceb587246998981e2a9bc2a897fbd9fcdcfe4fd8cf3d60aa480ac291f4b9659bfeaa1276cf", contentType: "application/octet-stream" },
  { id: "ubuntu-debian", name: "Vulcan Agent para Ubuntu e Debian", platform: "Ubuntu LTS / Debian 11–12 · amd64", filename: "vulcan-agent-linux-amd64.deb", key: "linux/vulcan-agent-linux-amd64.deb", size: "32,7 MB", sha512: "70595295f3b36e81f5366f91482d126f2cf41cff3decbabe0ea0bb75d86e931f98461267cd559f7ad0849b16b0bf8d23b7ab28c0ede9b3efb9fcbb751997d64e", contentType: "application/vnd.debian.binary-package" },
  { id: "debian-13", name: "Vulcan Agent para Debian", platform: "Debian 13 · amd64", filename: "vulcan-agent-debian-amd64.deb", key: "linux/vulcan-agent-debian-amd64.deb", size: "32,7 MB", sha512: "4a0f212a47e73f05c2807325e5df354867fd38c0d44efce77039f16d220cf7bb8385fd8ed3fd91abce9531e9086274b05cea541ed5416ec67bb369c512d26053", contentType: "application/vnd.debian.binary-package" },
  { id: "rhel", name: "Vulcan Agent para RHEL e derivados", platform: "RHEL / Rocky / Alma / Oracle · x86_64", filename: "vulcan-agent-linux-x86_64.rpm", key: "linux/vulcan-agent-linux-x86_64.rpm", size: "30,7 MB", sha512: "c82eb935224a5412f6a3ad6302339b05688935645e35e3e89cda7ca0fed44ed45871bcf1e470b2f1de8054ac7953e20df2c95ab3d9f31f88bf86fa738cbc85e1", contentType: "application/x-rpm" },
  { id: "amazon-linux", name: "Vulcan Agent para Amazon Linux", platform: "Amazon Linux 2023 · x86_64", filename: "vulcan-agent-amazon-linux-2023-x86_64.rpm", key: "linux/vulcan-agent-amazon-linux-2023-x86_64.rpm", size: "30,7 MB", sha512: "6ef9b3ef8759ed3254901e7cebe9e47ea7d14b9a8715d810aa450f0f2f35218d88a16ea4fc760796de3d5bb530038def29e0018f25981ea3f87baad591d49d34", contentType: "application/x-rpm" }
]);

function base64UrlEncode(input) {
  const bytes = input instanceof Uint8Array ? input : new TextEncoder().encode(input);
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function constantTimeEqual(left, right) {
  if (!(left instanceof Uint8Array) || !(right instanceof Uint8Array) || left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left[index] ^ right[index];
  return mismatch === 0;
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function createSession(username, secret) {
  const payload = base64UrlEncode(JSON.stringify({ username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }));
  return `${payload}.${base64UrlEncode(await hmac(payload, secret))}`;
}

async function sessionFrom(request, secret) {
  const match = request.headers.get("Cookie")?.match(/(?:^|;\s*)vulcan_download_session=([^;]+)/);
  if (!match) return null;
  try {
    const [payload, signature] = match[1].split(".");
    if (!payload || !signature || !constantTimeEqual(base64UrlDecode(signature), await hmac(payload, secret))) return null;
    const session = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    return session.exp > Math.floor(Date.now() / 1000) && typeof session.username === "string" ? session : null;
  } catch {
    return null;
  }
}

async function validPassword(password, storedHash) {
  const [iterations, salt, expectedHash] = String(storedHash || "").split(":");
  if (!/^\d+$/.test(iterations) || !salt || !expectedHash || typeof password !== "string") return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const output = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: base64UrlDecode(salt), iterations: Number(iterations) }, key, 256));
  return constantTimeEqual(output, base64UrlDecode(expectedHash));
}

function securityHeaders(extra = {}) {
  return new Headers({
    "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; upgrade-insecure-requests",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Cache-Control": "no-store",
    ...extra
  });
}

function htmlDocument(title, body) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} | Vulcan Defense</title><link rel="icon" href="/assets/favicon.ico"><link rel="stylesheet" href="/styles.css?v=20261029d"><link rel="stylesheet" href="/assets/business-products.css"></head><body class="bp-page secure-portal"><div class="grid-overlay"></div><header class="site-header"><div class="container header-wrap"><a class="brand" href="/business-products/" aria-label="Vulcan Defense — Business Products"><span class="logo-box"><img src="/assets/logo-vulcan.png" alt="" width="56" height="56"></span><span><span class="brand-name">Vulcan <em>Defense</em></span><span class="brand-tag">Customer Downloads</span></span></a><a class="header-cta" href="/business-products/">Voltar à central</a></div></header><main>${body}</main><footer><div class="container footer-bottom"><p>© 2026 Vulcan Defense. Área exclusiva para clientes autorizados.</p></div></footer></body></html>`;
}

function loginPage(error = false) {
  return htmlDocument("Acesso de clientes", `<section class="bp-hero secure-portal-hero"><div class="container secure-login-grid"><div><div class="bp-kicker">Área protegida</div><h1 class="bp-title">Downloads para <em>clientes</em></h1><p class="bp-lead">Acesse instaladores oficiais do Vulcan Agent, checksums SHA-512 e versões homologadas para o seu ambiente.</p></div><section class="secure-login-card" aria-labelledby="login-title"><h2 id="login-title">Entrar</h2><p>Use as credenciais fornecidas pela Vulcan Defense.</p>${error ? '<p class="secure-login-error" role="alert">Não foi possível validar suas credenciais.</p>' : ''}<form method="post" action="${PORTAL_PATH}/login"><label for="username">Usuário</label><input id="username" name="username" autocomplete="username" required><label for="password">Senha</label><input id="password" name="password" type="password" autocomplete="current-password" required><button class="btn btn-primary" type="submit">Acessar downloads</button></form><p class="secure-login-help">Não possui acesso? <a href="/contato.html">Fale com a Vulcan</a>.</p></section></div></section>`);
}

function packageCard(item) {
  return `<article class="secure-package-card"><div><span class="secure-package-platform">${item.platform}</span><h2>${item.name}</h2><p>${item.filename} · ${item.size}</p></div><div class="secure-package-checksum"><span>SHA-512</span><code>${item.sha512}</code></div><a class="btn btn-primary" href="${PORTAL_PATH}/download/${item.id}">Baixar pacote</a></article>`;
}

function downloadsPage(username) {
  return htmlDocument("Downloads de clientes", `<section class="bp-hero secure-portal-hero"><div class="container secure-portal-head"><div><div class="bp-kicker">Área de clientes</div><h1 class="bp-title">Vulcan Agent <em>Downloads</em></h1><p class="bp-lead">Versões validadas e entregues exclusivamente pelo canal autenticado. Verifique o SHA-512 antes de instalar.</p></div><form method="post" action="${PORTAL_PATH}/logout"><button class="secure-logout" type="submit">Sair</button></form></div></section><section class="secure-package-section"><div class="container"><div class="secure-package-intro"><p>Usuário autenticado: <strong>${username}</strong></p><p>Os downloads são registrados para fins operacionais. Não compartilhe os links recebidos.</p></div><div class="secure-package-grid">${PACKAGES.map(packageCard).join("")}</div></div></section>`);
}

function redirect(location, cookie) {
  const headers = securityHeaders({ Location: location });
  if (cookie) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    const session = await sessionFrom(request, env.SESSION_SECRET || "");

    if (request.method === "GET" && path === PORTAL_PATH) {
      return new Response(session ? downloadsPage(session.username) : loginPage(), { headers: securityHeaders({ "Content-Type": "text/html; charset=utf-8" }) });
    }

    if (request.method === "POST" && path === `${PORTAL_PATH}/login`) {
      const data = await request.formData();
      const username = String(data.get("username") || "");
      const password = String(data.get("password") || "");
      const authenticated = username === env.DOWNLOAD_USERNAME && await validPassword(password, env.DOWNLOAD_PASSWORD_HASH);
      if (!authenticated) return new Response(loginPage(true), { status: 401, headers: securityHeaders({ "Content-Type": "text/html; charset=utf-8" }) });
      const token = await createSession(username, env.SESSION_SECRET);
      return redirect(`${PORTAL_PATH}/`, `vulcan_download_session=${token}; Path=${PORTAL_PATH}; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`);
    }

    if (request.method === "POST" && path === `${PORTAL_PATH}/logout`) {
      return redirect(`${PORTAL_PATH}/`, "vulcan_download_session=; Path=/business-products/portal; Max-Age=0; HttpOnly; Secure; SameSite=Strict");
    }

    const downloadMatch = path.match(new RegExp(`^${PORTAL_PATH}/download/([a-z0-9-]+)$`));
    if (request.method === "GET" && downloadMatch) {
      if (!session) return redirect(`${PORTAL_PATH}/`);
      const item = PACKAGES.find((entry) => entry.id === downloadMatch[1]);
      if (!item) return new Response("Pacote não encontrado.", { status: 404, headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }) });
      const repository = String(env.GITHUB_REPOSITORY || "");
      const token = String(env.GITHUB_TOKEN || "");
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) || !token) return new Response("Portal de downloads indisponível.", { status: 503, headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }) });
      const artifactUrl = new URL(`https://api.github.com/repos/${repository}/contents/${item.key}`);
      artifactUrl.searchParams.set("ref", String(env.GITHUB_REF || "main"));
      const artifact = await fetch(artifactUrl, { headers: { "Accept": "application/vnd.github.raw+json", "Authorization": `Bearer ${token}`, "User-Agent": "vulcan-secure-downloads" } });
      if (!artifact.ok || !artifact.body) return new Response("Pacote indisponível.", { status: artifact.status === 404 ? 404 : 502, headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }) });
      return new Response(artifact.body, { headers: securityHeaders({ "Content-Type": item.contentType, "Content-Disposition": `attachment; filename=\"${item.filename}\"` }) });
    }

    return new Response("Recurso não encontrado.", { status: 404, headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }) });
  }
};
