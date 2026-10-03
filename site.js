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
      + '<a href="' + prefix + 'integracao-siem-ia.html">SIEM com IA</a>'
      + '<a href="' + prefix + 'compliance-ia.html">Compliance de IA</a>'
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
        services.innerHTML = '<h2>Servicios especializados</h2><div class="commercial-grid"><article class="info-card"><h3>Desarrollo de software seguro</h3><p>Diseño y desarrollo de aplicaciones, APIs e integraciones con requisitos de seguridad desde la arquitectura.</p><ul><li>Arquitectura, UX y desarrollo web, mobile y backend.</li><li>DevSecOps, revisión de código, SAST/DAST y pruebas de seguridad.</li><li>Integración con identidad, nube, observabilidad y sistemas existentes.</li></ul></article><article class="info-card"><h3>Investigación de incidentes</h3><p>Investigación técnica para determinar alcance, impacto y línea de tiempo de un incidente.</p><ul><li>Preservación de evidencias, análisis de logs, endpoints y cloud.</li><li>Identificación de compromiso, causa raíz y activos afectados.</li><li>Informe técnico, recomendaciones de contención y plan de remediación.</li></ul></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=desarrollo-e-investigacion">Solicitar propuesta</a></div>';
      } else if (language.indexOf("en") === 0) {
        services.innerHTML = '<h2>Specialized services</h2><div class="commercial-grid"><article class="info-card"><h3>Secure software development</h3><p>Design and delivery of applications, APIs and integrations with security built into the architecture.</p><ul><li>Architecture, UX and web, mobile and backend development.</li><li>DevSecOps, code review, SAST/DAST and security testing.</li><li>Identity, cloud, observability and existing-system integrations.</li></ul></article><article class="info-card"><h3>Incident investigation</h3><p>Technical investigation to determine an incident’s scope, impact and timeline.</p><ul><li>Evidence preservation and analysis of logs, endpoints and cloud.</li><li>Identification of compromise, root cause and affected assets.</li><li>Technical report, containment guidance and remediation plan.</li></ul></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=development-and-investigation">Request a proposal</a></div>';
      } else {
        services.innerHTML = '<h2>Serviços especializados</h2><div class="commercial-grid"><article class="info-card"><h3>Desenvolvimento de software seguro</h3><p>Concepção e entrega de aplicações, APIs e integrações com segurança incorporada desde a arquitetura.</p><ul><li>Arquitetura, UX e desenvolvimento web, mobile e backend.</li><li>DevSecOps, revisão de código, SAST/DAST e testes de segurança.</li><li>Integração com identidade, nuvem, observabilidade e sistemas existentes.</li></ul></article><article class="info-card"><h3>Investigação de incidentes</h3><p>Investigação técnica para determinar escopo, impacto e linha do tempo de um incidente.</p><ul><li>Preservação de evidências e análise de logs, endpoints e cloud.</li><li>Identificação de comprometimento, causa raiz e ativos afetados.</li><li>Relatório técnico, recomendações de contenção e plano de remediação.</li></ul></article></div><div class="commercial-cta"><a class="btn btn-primary" href="contato.html?servico=desenvolvimento-e-investigacao">Solicitar proposta</a></div>';
      }
      commercialWrap.appendChild(services);
    }
  }
})();
