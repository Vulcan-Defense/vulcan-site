(function () {
  "use strict";

  var header = document.querySelector("body > header");
  if (!header) return;

  var main = document.querySelector("main");
  if (main) {
    main.id = main.id || "conteudo-principal";
    var skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = "#" + main.id;
    skipLink.textContent = "Ir para o conteúdo principal";
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  var headerWrap = header.querySelector(".header-wrap");
  var nav = headerWrap && headerWrap.querySelector(":scope > nav");
  if (!headerWrap || !nav) return;

  function navPrefix() {
    var path = window.location.pathname.replace(/\\/g, "/");
    if (path.indexOf("/business-products/vulcan-siem") !== -1) return "../../";
    if (path.indexOf("/business-products") !== -1) return "../";
    return "";
  }

  function buildPrimaryNav(prefix) {
    return ''
      + '<div class="nav-item has-submenu">'
      + '<a href="' + prefix + 'software-vulcan-platform.html">Plataforma</a>'
      + '<div class="submenu">'
      + '<a href="' + prefix + 'software-vulcan-platform.html">Vulcan Platform</a>'
      + '<a href="' + prefix + 'endpoint-protection-siem.html">Endpoint Protection e SIEM</a>'
      + '<a href="' + prefix + 'business-products/">Business Products</a>'
      + '<a href="' + prefix + 'siem-ot.html">Vulcan-SIEM OT</a>'
      + '</div></div>'
      + '<div class="nav-item has-submenu">'
      + '<a href="' + prefix + 'servicos.html">Serviços</a>'
      + '<div class="submenu">'
      + '<a href="' + prefix + 'cyber-defense.html">Cyber defense e SOC</a>'
      + '<a href="' + prefix + 'pentest-yellow-team-secops-dast.html">Pentest e SecOps</a>'
      + '<a href="' + prefix + 'integracao-siem-ia.html">SIEM com Superinteligência</a>'
      + '<a href="' + prefix + 'compliance-ia.html">Compliance de Superinteligência</a>'
      + '<a href="' + prefix + 'checklist-seguranca.html">Checklist SI (ISO/LGPD/PCI)</a>'
      + '<a href="' + prefix + 'security-champions.html">Security Champions</a>'
      + '<a href="' + prefix + 'treinamentos-owasp-mitre.html">Treinamentos OWASP e MITRE</a>'
      + '<a href="' + prefix + 'hackathon-defensivo.html">Hackathon defensivo</a>'
      + '<a href="' + prefix + 'relatorio-global.html">Relatório global</a>'
      + '<a href="https://academy.vulcandefense.com.br" class="partner-external" target="_blank" rel="noopener noreferrer" title="Cursos e Certificações">Academia Vulcan</a>'
      + '</div></div>'
      + '<div class="nav-item has-submenu">'
      + '<a href="' + prefix + 'quem-somos.html">Quem somos</a>'
      + '<div class="submenu">'
      + '<a href="' + prefix + 'quem-somos.html">Sobre a Vulcan</a>'
      + '<a href="' + prefix + 'banco-de-talentos.html">Banco de Talentos</a>'
      + '</div></div>'
      + '<a href="' + prefix + 'contato.html">Contato</a>';
  }

  var prefix = navPrefix();
  nav.innerHTML = buildPrimaryNav(prefix);

  var brand = headerWrap.querySelector(".brand");
  if (brand && !brand.querySelector("a")) {
    var brandLink = document.createElement("a");
    brandLink.href = prefix + "index.html";
    brandLink.className = "brand-home";
    brandLink.setAttribute("aria-label", "Vulcan Defense — início");
    while (brand.firstChild) brandLink.appendChild(brand.firstChild);
    brand.appendChild(brandLink);
  }

  nav.id = nav.id || "primary-navigation";
  nav.setAttribute("aria-label", "Navegação principal");

  var menuButton = document.createElement("button");
  menuButton.className = "menu-toggle";
  menuButton.type = "button";
  menuButton.setAttribute("aria-controls", nav.id);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  menuButton.innerHTML = '<span></span><span></span><span></span>';
  headerWrap.insertBefore(menuButton, nav);

  function setMenu(open) {
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("nav-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }

  menuButton.addEventListener("click", function () {
    setMenu(!header.classList.contains("menu-open"));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a") && window.innerWidth <= 980) setMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && header.classList.contains("menu-open")) {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) setMenu(false);
  });

  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  nav.querySelectorAll("a").forEach(function (link) {
    var target = (link.getAttribute("href") || "").split("#")[0];
    if (!target || target.indexOf(":") !== -1) return;
    var targetName = target.split("/").filter(Boolean).pop() || "";
    var here = window.location.pathname.replace(/\\/g, "/");
    var isCurrent = targetName === currentPage
      || (target.endsWith("business-products/") && here.indexOf("/business-products") !== -1)
      || (target.endsWith("business-products") && here.indexOf("/business-products") !== -1);
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  nav.querySelectorAll(".has-submenu").forEach(function (item) {
    if (item.querySelector(".submenu a[aria-current='page']")) {
      var parentLink = item.querySelector(":scope > a");
      if (parentLink) parentLink.classList.add("active");
    }
  });

  var progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  function updatePageState() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  updatePageState();
  window.addEventListener("scroll", updatePageState, { passive: true });

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sections = document.querySelectorAll("main > section");
  if (!reducedMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-ready");
    sections.forEach(function (section) { section.classList.add("site-reveal"); });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        sectionObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.04 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  var footerContainer = document.querySelector("footer .container");
  if (footerContainer && !footerContainer.querySelector(".site-legal")) {
    var legal = document.createElement("span");
    legal.className = "site-legal";
    legal.textContent = "VULCAN DEFENSE LTDA - ME · CNPJ 51.530.057/0001-33";
    footerContainer.appendChild(legal);
  }
  if (footerContainer && !footerContainer.querySelector(".site-address")) {
    var address = document.createElement("address");
    address.className = "site-address";
    address.textContent = "Avenida Marechal Câmara, 160, Sala 1107, Centro, Rio de Janeiro - RJ, 20020-080";
    footerContainer.appendChild(address);
  }
  if (footerContainer && !footerContainer.querySelector(".site-linkedin")) {
    var linkedin = document.createElement("a");
    linkedin.className = "site-linkedin";
    linkedin.href = "https://www.linkedin.com/company/112516097/admin/dashboard/";
    linkedin.target = "_blank";
    linkedin.rel = "noopener noreferrer";
    linkedin.setAttribute("aria-label", "LinkedIn da Vulcan Defense");
    linkedin.textContent = "LinkedIn";
    footerContainer.appendChild(linkedin);
  }
  if (footerContainer && !footerContainer.querySelector(".site-footer-nav")) {
    var footerNav = document.createElement("nav");
    footerNav.className = "site-footer-nav";
    footerNav.setAttribute("aria-label", "Links institucionais");
    var fp = navPrefix();
    footerNav.innerHTML = ''
      + '<a href="' + fp + 'politica-privacidade.html">Política de Privacidade</a>'
      + '<a href="' + fp + 'banco-de-talentos.html">Banco de Talentos</a>'
      + '<a href="' + fp + 'tecnologias.html">Escopos técnicos</a>'
      + '<a href="' + fp + 'gestao-tms-flsys-leanworks.html">Serviços parceiros</a>';
    footerContainer.appendChild(footerNav);
  }
  if (document.querySelector(".commercial-page")) {
    var currencyScript = document.createElement("script");
    currencyScript.src = "assets/currency-switcher.js";
    currencyScript.defer = true;
    document.head.appendChild(currencyScript);

    var commercialWrap = document.querySelector(".commercial-wrap");
    if (commercialWrap && !commercialWrap.querySelector(".commercial-services")) {
      var language = document.documentElement.lang || "pt-BR";
      var services = document.createElement("section");
      services.className = "commercial-section commercial-services";
      if (language.indexOf("es") === 0) {
        services.innerHTML = '<h2>Servicios especializados</h2><div class="commercial-grid"><article class="info-card"><h3>Desarrollo de software seguro</h3><p>Diseño y desarrollo de aplicaciones, APIs e integraciones con requisitos de seguridad desde la arquitectura.</p><div class="development-stack"><span>React · Next.js</span><span>Node.js · Python</span><span>Flutter</span><span>PostgreSQL · Redis</span><span>AWS · Azure · GCP</span><span>Docker · Kubernetes</span><span>CI/CD · IaC</span></div><ul><li>Arquitectura, UX y desarrollo web, mobile y backend.</li><li>DevSecOps, revisión de código, SAST/DAST y pruebas de seguridad.</li><li>Integración con identidad, nube, observabilidad y sistemas existentes.</li></ul></article><article class="info-card"><h3>Investigación de incidentes</h3><p>Investigación técnica para determinar alcance, impacto y línea de tiempo de un incidente.</p><ul><li>Preservación de evidencias, análisis de logs, endpoints y cloud.</li><li>Identificación de compromiso, causa raíz y activos afectados.</li><li>Informe técnico, recomendaciones de contención y plan de remediación.</li></ul></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=desarrollo-e-investigacion">Solicitar propuesta</a></div>';
      } else if (language.indexOf("en") === 0) {
        services.innerHTML = '<h2>Specialized services</h2><div class="commercial-grid"><article class="info-card"><h3>Secure software development</h3><p>Design and delivery of applications, APIs and integrations with security built into the architecture.</p><div class="development-stack"><span>React · Next.js</span><span>Node.js · Python</span><span>Flutter</span><span>PostgreSQL · Redis</span><span>AWS · Azure · GCP</span><span>Docker · Kubernetes</span><span>CI/CD · IaC</span></div><ul><li>Architecture, UX and web, mobile and backend development.</li><li>DevSecOps, code review, SAST/DAST and security testing.</li><li>Identity, cloud, observability and existing-system integrations.</li></ul></article><article class="info-card"><h3>Incident investigation</h3><p>Technical investigation to determine an incident’s scope, impact and timeline.</p><ul><li>Evidence preservation and analysis of logs, endpoints and cloud.</li><li>Identification of compromise, root cause and affected assets.</li><li>Technical report, containment guidance and remediation plan.</li></ul></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=development-and-investigation">Request a proposal</a></div>';
      } else {
        services.innerHTML = '<h2>Serviços especializados</h2><div class="commercial-grid"><article class="info-card"><h3>Desenvolvimento de software seguro</h3><p>Concepção e entrega de aplicações, APIs e integrações com segurança incorporada desde a arquitetura.</p><div class="development-stack"><span>React · Next.js</span><span>Node.js · Python</span><span>Flutter</span><span>PostgreSQL · Redis</span><span>AWS · Azure · GCP</span><span>Docker · Kubernetes</span><span>CI/CD · IaC</span></div><ul><li>Arquitetura, UX e desenvolvimento web, mobile e backend.</li><li>DevSecOps, revisão de código, SAST/DAST e testes de segurança.</li><li>Integração com identidade, nuvem, observabilidade e sistemas existentes.</li></ul></article><article class="info-card"><h3>Investigação de incidentes</h3><p>Investigação técnica para determinar escopo, impacto e linha do tempo de um incidente.</p><ul><li>Preservação de evidências e análise de logs, endpoints e cloud.</li><li>Identificação de comprometimento, causa raiz e ativos afetados.</li><li>Relatório técnico, recomendações de contenção e plano de remediação.</li></ul></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=desenvolvimento-e-investigacao">Solicitar proposta</a></div>';
      }
      commercialWrap.appendChild(services);

      var dlp = document.createElement("section");
      dlp.className = "commercial-section commercial-dlp";
      if (language.indexOf("es") === 0) {
        dlp.innerHTML = '<h2>Vulcan DLP - detección, respuesta y conformidad</h2><p>Un módulo gestionado para convertir alertas de posible fuga de datos en casos priorizados, con contexto operativo y soporte a decisiones LGPD. El despliegue comienza en modo monitorización; las acciones de contención siguen playbooks con aprobación.</p><div class="commercial-grid"><article class="info-card"><h3>Detección y contexto</h3><ul><li>Monitoreo de carpetas sensibles, acceso masivo, medios USB y transferencias no autorizadas.</li><li>Correlación de acceso, compresión, copia, carga y correo en una misma línea de tiempo.</li><li>Detectores para CPF, CNPJ, PIX, datos bancarios, secretos técnicos y datos sensibles LGPD.</li></ul></article><article class="info-card"><h3>Integraciones y descubrimiento</h3><ul><li>Ingesta de alertas de Microsoft Purview/M365, Google Workspace, firewall, proxy y DNS.</li><li>Descubrimiento de datos en repositorios críticos, SharePoint, Drive, SMB y buckets cloud.</li><li>Inventario de uso de Superinteligência generativa y visibilidad de shadow Super Intelligence.</li></ul></article><article class="info-card"><h3>Respuesta y LGPD</h3><ul><li>Casos de fuga con evidencias, activos, usuario, tipo de dato y línea de tiempo.</li><li>Checklist de evaluación de riesgo y control del plazo de 3 días hábiles de la ANPD.</li><li>Playbooks aprobados para contener, escalar y documentar la respuesta.</li></ul></article><article class="info-card"><h3>Gobernanza y OT</h3><ul><li>Políticas por segmento, paneles por tenant y ciclo auditable de ajustes.</li><li>Mapa de datos personales, exposición externa y permisos excesivos.</li><li>Protección de proyectos de ingeniería y estaciones OT, sin contención automática en planta.</li></ul></article></div><p class="commercial-note">Funciones sujetas al alcance contratado, licencias de terceros e integración validada. La prevención activa por contenido se ofrece con socios de endpoint en etapas posteriores.</p><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=vulcan-dlp">Solicitar diagnóstico DLP</a></div>';
      } else if (language.indexOf("en") === 0) {
        dlp.innerHTML = '<h2>Vulcan DLP - detection, response and compliance</h2><p>A managed module that turns potential data-leak alerts into prioritized cases, with operational context and support for LGPD decisions. Deployment begins in monitoring mode; containment follows approved playbooks.</p><div class="commercial-grid"><article class="info-card"><h3>Detection and context</h3><ul><li>Monitoring of sensitive folders, bulk access, USB media and unauthorized transfers.</li><li>Correlation of access, compression, copy, upload and email into one timeline.</li><li>Detectors for Brazilian identifiers, payment data, technical secrets and sensitive personal data.</li></ul></article><article class="info-card"><h3>Integrations and discovery</h3><ul><li>Ingestion from Microsoft Purview/M365, Google Workspace, firewall, proxy and DNS.</li><li>Data discovery in critical repositories, SharePoint, Drive, SMB and cloud buckets.</li><li>Generative-Super Intelligence inventory and shadow-Super Intelligence visibility.</li></ul></article><article class="info-card"><h3>Response and LGPD</h3><ul><li>Leakage cases with evidence, assets, user, data type and timeline.</li><li>Risk-assessment checklist and tracking for ANPD’s three-business-day deadline.</li><li>Approved playbooks to contain, escalate and document the response.</li></ul></article><article class="info-card"><h3>Governance and OT</h3><ul><li>Segment policies, tenant dashboards and auditable policy tuning.</li><li>Personal-data map, external exposure and excessive-permission discovery.</li><li>Engineering-project and OT-workstation protection, without automatic plant containment.</li></ul></article></div><p class="commercial-note">Functions depend on contracted scope, third-party licenses and validated integrations. Active content prevention is delivered with endpoint partners in later stages.</p><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=vulcan-dlp">Request a DLP assessment</a></div>';
      } else {
        dlp.innerHTML = '<h2>Vulcan DLP - detecção, resposta e conformidade</h2><p>Módulo gerenciado para transformar alertas de possível vazamento em casos priorizados, com contexto operacional e apoio à decisão LGPD. A implantação começa em modo de monitoramento; ações de contenção seguem playbooks com aprovação.</p><div class="commercial-grid"><article class="info-card"><h3>Detecção e contexto</h3><ul><li>Monitoramento de pastas sensíveis, acesso em massa, mídia USB e transferências não autorizadas.</li><li>Correlação de acesso, compactação, cópia, upload e e-mail em uma única linha do tempo.</li><li>Detectores para CPF, CNPJ, PIX, dados bancários, segredos técnicos e dados sensíveis LGPD.</li></ul></article><article class="info-card"><h3>Integrações e descoberta</h3><ul><li>Ingestão de alertas do Microsoft Purview/M365, Google Workspace, firewall, proxy e DNS.</li><li>Descoberta de dados em repositórios críticos, SharePoint, Drive, SMB e buckets em nuvem.</li><li>Inventário do uso de Superinteligência generativa e visibilidade de shadow Super Intelligence.</li></ul></article><article class="info-card"><h3>Resposta e LGPD</h3><ul><li>Casos de vazamento com evidências, ativos, usuário, tipo de dado e linha do tempo.</li><li>Checklist de avaliação de risco e acompanhamento do prazo de 3 dias úteis da ANPD.</li><li>Playbooks aprovados para conter, escalar e documentar a resposta.</li></ul></article><article class="info-card"><h3>Governança e OT</h3><ul><li>Políticas por segmento, painéis por tenant e ciclo auditável de ajustes.</li><li>Mapa de dados pessoais, exposição externa e descoberta de permissões excessivas.</li><li>Proteção de projetos de engenharia e estações OT, sem contenção automática na planta.</li></ul></article></div><p class="commercial-note">Funções sujeitas ao escopo contratado, licenças de terceiros e integrações validadas. A prevenção ativa por conteúdo é oferecida com parceiros de endpoint em etapas posteriores.</p><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=vulcan-dlp">Solicitar diagnóstico DLP</a></div>';
      }
      commercialWrap.appendChild(dlp);

      var aiSecurity = document.createElement("section");
      aiSecurity.className = "commercial-section ai-security";
      if (language.indexOf("es") === 0) {
        aiSecurity.innerHTML = '<div class="ai-security-layout"><div class="ai-security-copy"><h2>Seguridad con Superinteligência</h2><p>Protección práctica para modelos, aplicaciones y agentes de Superinteligência antes de que lleguen a producción. Evaluamos controles técnicos, rutas de abuso y decisiones humanas de aprobación.</p><div class="ai-security-capabilities"><article><h3>Protección contra ingeniería inversa</h3><p>Evaluación de extracción de modelos, filtración de prompts, exposición de pesos y abuso de APIs.</p></article><article><h3>Hardening de Superinteligência</h3><p>Identidad, secretos, segmentación, límites, telemetría y configuraciones seguras para el ciclo de vida del modelo.</p></article><article><h3>Agentes gobernados</h3><p>Permisos mínimos, herramientas autorizadas, validación de acciones y trazabilidad de cada ejecución.</p></article><article><h3>Revisión especializada</h3><p>Threat modeling, revisión de arquitectura y pruebas de prompt injection, data poisoning y tool abuse.</p></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=seguranca-ia">Solicitar revisión de seguridad con Superinteligência</a></div></div><div class="ai-security-media"><figure><img src="assets/ai-security-model-defense.png" alt="Modelo de Superinteligência protegido por controles de seguridad"><figcaption>Defensa de modelos y APIs</figcaption></figure><figure><img src="assets/ai-security-agent-governance.png" alt="Agentes de Superinteligência bajo controles y aprobación"><figcaption>Agentes con permisos y revisión</figcaption></figure></div></div></section>';
      } else if (language.indexOf("en") === 0) {
        aiSecurity.innerHTML = '<div class="ai-security-layout"><div class="ai-security-copy"><h2>Super Intelligence security</h2><p>Practical protection for Super Intelligence models, applications and agents before production deployment. We assess technical controls, abuse paths and human approval decisions.</p><div class="ai-security-capabilities"><article><h3>Reverse-engineering protection</h3><p>Assessment of model extraction, prompt leakage, weight exposure and API abuse.</p></article><article><h3>Super Intelligence hardening</h3><p>Identity, secrets, segmentation, limits, telemetry and secure configuration across the model lifecycle.</p></article><article><h3>Governed agents</h3><p>Least privilege, approved tools, action validation and a trace for every execution.</p></article><article><h3>Specialist review</h3><p>Threat modeling, architecture review and testing for prompt injection, data poisoning and tool abuse.</p></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=ai-security">Request an Super Intelligence security review</a></div></div><div class="ai-security-media"><figure><img src="assets/ai-security-model-defense.png" alt="Super Intelligence model protected by security controls"><figcaption>Model and API defense</figcaption></figure><figure><img src="assets/ai-security-agent-governance.png" alt="Super Intelligence agents under policy and approval controls"><figcaption>Agents with permissions and review</figcaption></figure></div></div></section>';
      } else {
        aiSecurity.innerHTML = '<div class="ai-security-layout"><div class="ai-security-copy"><h2>Segurança com Superinteligência</h2><p>Proteção prática para modelos, aplicações e agentes de Superinteligência antes de chegarem à produção. Avaliamos controles técnicos, caminhos de abuso e decisões humanas de aprovação.</p><div class="ai-security-capabilities"><article><h3>Proteção contra engenharia reversa</h3><p>Avaliação de extração de modelos, vazamento de prompts, exposição de pesos e abuso de APIs.</p></article><article><h3>Hardening de Superinteligência</h3><p>Identidade, segredos, segmentação, limites, telemetria e configurações seguras para o ciclo de vida do modelo.</p></article><article><h3>Agentes governados</h3><p>Privilégio mínimo, ferramentas autorizadas, validação de ações e rastreabilidade de cada execução.</p></article><article><h3>Revisão especializada</h3><p>Threat modeling, revisão de arquitetura e testes de prompt injection, data poisoning e tool abuse.</p></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=seguranca-ia">Solicitar revisão de Segurança com Superinteligência</a></div></div><div class="ai-security-media"><figure><img src="assets/ai-security-model-defense.png" alt="Modelo de Superinteligência protegido por controles de segurança"><figcaption>Defesa de modelos e APIs</figcaption></figure><figure><img src="assets/ai-security-agent-governance.png" alt="Agentes de Superinteligência sob controles e aprovação"><figcaption>Agentes com permissões e revisão</figcaption></figure></div></div></section>';
      }
      commercialWrap.appendChild(aiSecurity);
    }
  }
})();
