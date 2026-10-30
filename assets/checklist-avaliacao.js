/* Extraído de checklist-seguranca.html para permitir CSP sem 'unsafe-inline' em script-src. */
(function () {
  const THRESHOLD = 0.80;

  const ISO_CONTROLS = [
    ["A.5.1", "Políticas para segurança da informação"],
    ["A.5.2", "Funções e responsabilidades de segurança da informação"],
    ["A.5.7", "Inteligência de ameaças"],
    ["A.5.9", "Inventário de informação e outros ativos associados"],
    ["A.5.10", "Uso de criptografia"],
    ["A.5.12", "Classificação da informação"],
    ["A.5.14", "Transferência de informação"],
    ["A.5.23", "Segurança da informação para uso de serviços de nuvem"],
    ["A.5.24", "Uso de tecnologia de processamento da informação"],
    ["A.5.25", "Regras de ordenação de informações"],
    ["A.5.26", "Respostas a incidentes de segurança da informação"],
    ["A.5.29", "Segurança da informação durante desligamento"],
    ["A.5.30", "Preparação ICT para continuidade de negócios"],
    ["A.5.31", "Conformidade legal, estatutária e contratual"],
    ["A.5.37", "Procedimentos operacionais documentados"],
    ["A.6.1", "Triagem de colaboradores e terceiros"],
    ["A.6.2", "Termos e condições de emprego"],
    ["A.6.3", "Conscientização, educação e treinamento em SI"],
    ["A.6.6", "Processo disciplinar por não conformidade"],
    ["A.7.1", "Controles de perímetro físico"],
    ["A.7.2", "Controles de entrada física"],
    ["A.7.4", "Monitoramento de segurança física"],
    ["A.7.7", "Descarte ou reutilização segura de equipamentos"],
    ["A.8.1", "Controles de inventário de usuários"],
    ["A.8.2", "Privilégios de acesso de usuário"],
    ["A.8.3", "Responsabilização de informação"],
    ["A.8.5", "Autenticação segura"],
    ["A.8.8", "Gestão de vulnerabilidades técnicas"],
    ["A.8.9", "Gestão de configuração"],
    ["A.8.10", "Exclusão de informação"],
    ["A.8.11", "Mascaramento de dados"],
    ["A.8.12", "Prevenção de vazamento de informações"],
    ["A.8.16", "Registro de atividades (logging)"],
    ["A.8.17", "Relógios sincronizados em sistemas"],
    ["A.8.23", "Filtragem web"],
    ["A.8.24", "Uso de criptografia"],
    ["A.8.28", "Desenvolvimento seguro (secure coding)"]
  ];

  const LGPD_ITEMS = [
    ["Art. 6º I", "Finalidade: tratamento para propósitos legítimos e informados ao titular"],
    ["Art. 6º II", "Adequação: compatibilidade entre tratamento e finalidades informadas"],
    ["Art. 6º III", "Necessidade: limitação ao mínimo necessário de dados"],
    ["Art. 6º IV", "Livre acesso: consulta facilitada e gratuita aos dados"],
    ["Art. 6º V", "Qualidade dos dados: exatidão, clareza e atualização"],
    ["Art. 6º VI", "Transparência: informações claras sobre o tratamento"],
    ["Art. 6º VII", "Segurança: medidas técnicas e administrativas contra acessos não autorizados"],
    ["Art. 6º VIII", "Prevenção: evitar danos do tratamento indevido"],
    ["Art. 6º IX", "Não discriminação"],
    ["Art. 6º X", "Responsabilização e prestação de contas"],
    ["Base legal", "Documentação de base legal para cada tratamento"],
    ["Consentimento", "Mecanismos de consentimento quando aplicável"],
    ["Registro", "Registros de atividades de processamento (Art. 37)"],
    ["DPO", "Designação de encarregado (DPO) quando obrigatório"],
    ["Titulares", "Resposta a solicitações de titulares em até 15 dias"],
    ["Breach", "Notificação à ANPD em caso de incidente (prazo legal)"]
  ];

  const PCI_ITEMS = [
    ["Req. 1", "Instalar e manter controles de segurança de rede (firewalls)"],
    ["Req. 1", "Revisar configurações de firewall ao menos a cada 6 meses"],
    ["Req. 2", "Aplicar configurações seguras (evitar padrões de fornecedor)"],
    ["Req. 2", "Implementar senhas fortes e hardening de sistemas"],
    ["Req. 3", "Proteger dados de conta armazenados (criptografia/mascaramento)"],
    ["Req. 3", "Limitar armazenamento ao estritamente necessário"],
    ["Req. 4", "Criptografar dados de titulares em trânsito em redes abertas"],
    ["Req. 5", "Proteger contra malware (antimalware atualizado)"],
    ["Req. 6", "Desenvolver e manter sistemas e aplicações seguros"],
    ["Req. 6", "Aplicar patches de segurança em sistemas e aplicações"],
    ["Req. 7", "Restringir acesso a dados por necessidade de conhecimento"],
    ["Req. 8", "Identificar e autenticar usuários com IDs únicos"],
    ["Req. 8", "Autenticação multifator para acesso a sistemas"],
    ["Req. 9", "Restringir acesso físico a dados de titulares"],
    ["Req. 10", "Registrar e monitorar acesso a rede e dados"],
    ["Req. 11", "Testar regularmente sistemas e processos de segurança"],
    ["Req. 12", "Manter política de segurança da informação documentada"],
    ["Req. 12", "Treinamento de segurança para toda a equipe"]
  ];

  const SOC2_ITEMS = [
    ["CC1", "Ambiente de controle: governança, responsabilidades e cultura de segurança"],
    ["CC2", "Comunicação e informação: políticas e procedimentos documentados e divulgados"],
    ["CC3", "Avaliação de riscos: processo periódico de identificação e análise de riscos"],
    ["CC4", "Monitoramento: atividades de supervisão e avaliação contínua de controles"],
    ["CC5", "Atividades de controle: implementação de controles para mitigar riscos"],
    ["CC6.1", "Controle lógico: gestão de identidade e acesso (IAM, MFA)"],
    ["CC6.2", "Controle físico: proteção e restrição de acesso a instalações e ativos"],
    ["CC7.1", "Operações: detecção e resposta a incidentes de segurança"],
    ["CC7.2", "Operações: proteção contra malware e vulnerabilidades"],
    ["CC7.3", "Operações: backup e recuperação de dados"],
    ["CC8.1", "Gestão de mudanças: processo formal de aprovação e implementação"],
    ["CC8.2", "Gestão de mudanças: avaliação de impacto e teste antes de produção"],
    ["CC9.1", "Mitigação de risco: gestão de vulnerabilidades e patching"],
    ["CC9.2", "Mitigação de risco: gestão de fornecedores e terceiros críticos"]
  ];

  const DEVSECOPS_ITEMS = [
    ["SAST", "Análise estática de código (SAST) integrada ao pipeline de CI"],
    ["DAST", "Testes dinâmicos de segurança (DAST/IAST) em etapas de build ou staging"],
    ["SCA", "Scan de dependências (SCA) para vulnerabilidades em bibliotecas"],
    ["Secrets", "Gestão de segredos fora do código (vault, variáveis de ambiente seguras)"],
    ["IaC", "Revisão de segurança em Infrastructure as Code (Terraform, CloudFormation)"],
    ["Container", "Scan de imagens de container por vulnerabilidades"],
    ["Code Review", "Revisão de código com critérios de segurança documentados"],
    ["Threat Model", "Modelagem de ameaças em funcionalidades críticas"],
    ["OWASP", "Conhecimento de OWASP Top 10 e ASVS pelo time de desenvolvimento"],
    ["SBOM", "Geração de Software Bill of Materials (SBOM) para aplicações"],
    ["Pipeline", "Gate de segurança no pipeline (bloqueio em falha crítica)"],
    ["Remediation", "Processo de correção e reteste de vulnerabilidades identificadas"]
  ];

  const FIN_ITEMS = [
    ["Orçamento", "Planejamento anual de orçamento de TI alinhado a metas de negócio"],
    ["TCO", "Análise de custo total de propriedade (TCO) em decisões de aquisição"],
    ["Chargeback", "Modelo de repasse ou alocação de custos de TI (chargeback/showback)"],
    ["Contratos", "Gestão centralizada de contratos e datas de renovação"],
    ["Licenças", "Inventário e controle de licenças de software"],
    ["FinOps", "Monitoramento e otimização de custos em cloud (tags, alertas, right-sizing)"],
    ["Ativos", "Ciclo de vida de ativos (aquisição, depreciação, descarte)"],
    ["ROI", "Avaliação de retorno e priorização de investimentos em TI"],
    ["Governança", "Fluxo de aprovação e controle de gastos de TI"],
    ["Provisão", "Reserva para contingências e projetos emergenciais"],
    ["Fornecedores", "Processo de qualificação e acompanhamento de fornecedores"],
    ["Visibilidade", "Relatórios de custos para tomada de decisão e auditoria"]
  ];

  const GOVIA_ITEMS = [
    ["Política de uso", "Política de uso de IA & Superinteligência documentada: diretrizes, proibições e critérios de aprovação"],
    ["Comitê/Governança", "Comitê ou estrutura de governança de IA & Superinteligência com responsáveis definidos"],
    ["Inventário", "Inventário de sistemas de IA & Superinteligência com classificação por nível de risco (alto, médio, baixo)"],
    ["Equidade", "Avaliação de viés e equidade em dados de treinamento e decisões"],
    ["Transparência", "Explicabilidade e documentação de decisões dos sistemas de IA & Superinteligência"],
    ["Supervisão humana", "Supervisão humana efetiva em sistemas de alto impacto"],
    ["Privacidade", "Proteção de dados pessoais em conformidade com LGPD em todo ciclo de IA & Superinteligência"],
    ["Segurança", "Desenvolvimento com princípio da não maleficência e mitigação de riscos"],
    ["Shadow AI & Super Intelligence", "Controles para identificação e aprovação de uso de IA & Superinteligência não autorizada (shadow AI & Super Intelligence)"],
    ["Auditoria", "Auditoria periódica de aderência e amostragem de uso"],
    ["Registro de atividades", "Logs e registro de prompts e interações para rastreabilidade"],
    ["Tratamento de incidentes", "Processo de resposta a incidentes relacionados a IA & Superinteligência"]
  ];

  const STORAGE_KEY = "vulcan_checklist_si";
  const DATA = { iso: ISO_CONTROLS, lgpd: LGPD_ITEMS, pci: PCI_ITEMS, soc2: SOC2_ITEMS, devsecops: DEVSECOPS_ITEMS, fin: FIN_ITEMS, govia: GOVIA_ITEMS };

  const REF_LINKS = {
    iso: "https://www.iso.org/standard/27001",
    lgpd: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    pci: "https://www.pcisecuritystandards.org/",
    soc2: "https://www.aicpa.org/soc2",
    devsecops: "https://owasp.org/www-project-devsecops-guideline/",
    fin: "https://www.finops.org/framework/",
    govia: "https://www.gov.br/governodigital/pt-br/infraestrutura-nacional-de-dados/inteligencia-artificial-1/publicacoes/framework-para-a-autoavaliacao-de-impacto-etico-em-inteligencia-artificial-no-setor-publico-federal"
  };

  let state = { iso: {}, lgpd: {}, pci: {}, soc2: {}, devsecops: {}, fin: {}, govia: {} };

  function loadState() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        state = { iso: parsed.iso || {}, lgpd: parsed.lgpd || {}, pci: parsed.pci || {}, soc2: parsed.soc2 || {}, devsecops: parsed.devsecops || {}, fin: parsed.fin || {}, govia: parsed.govia || {} };
      }
    } catch (_) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function renderTable(fw, tbodyId) {
    const items = DATA[fw];
    const tbody = document.getElementById(tbodyId);
    const refUrl = REF_LINKS[fw] || "#";
    tbody.replaceChildren();
    items.forEach(([ref, desc], i) => {
      const key = String(i);
      const val = (state[fw] && state[fw][key]) || "";
      const tr = document.createElement("tr");
      const refTd = document.createElement("td");
      const refLink = document.createElement("a");
      refLink.href = refUrl;
      refLink.target = "_blank";
      refLink.rel = "noopener noreferrer";
      refLink.className = "cl-ref-link";
      refLink.title = desc;
      refLink.textContent = ref;
      refTd.appendChild(refLink);

      const descTd = document.createElement("td");
      descTd.textContent = desc;
      const statusTd = document.createElement("td");
      const group = document.createElement("div");
      group.className = "cl-status-group";
      [["OK", "active-ok"], ["Não OK", "active-nok"], ["N/A", "active-na"]].forEach(([status, activeClass]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cl-status-btn";
        btn.dataset.status = status;
        btn.textContent = status;
        if (val === status) btn.classList.add(activeClass);
        group.appendChild(btn);
        btn.addEventListener("click", () => {
          const st = btn.dataset.status;
          state[fw] = state[fw] || {};
          state[fw][key] = state[fw][key] === st ? "" : st;
          saveState();
          renderTable(fw, tbodyId);
          updateSummary(fw);
          updateDonut(fw);
          updateResumo();
        });
      });
      statusTd.appendChild(group);
      tr.append(refTd, descTd, statusTd);
      tbody.appendChild(tr);
    });
  }

  function calcPct(fw) {
    const items = DATA[fw];
    let ok = 0, nok = 0;
    for (let i = 0; i < items.length; i++) {
      const v = (state[fw] && state[fw][String(i)]) || "";
      if (v === "OK") ok++;
      else if (v === "Não OK") nok++;
    }
    const total = ok + nok;
    if (total === 0) return null;
    return ok / total;
  }

  function calcCounts(fw) {
    const items = DATA[fw];
    let ok = 0, nok = 0, na = 0;
    for (let i = 0; i < items.length; i++) {
      const v = (state[fw] && state[fw][String(i)]) || "";
      if (v === "OK") ok++;
      else if (v === "Não OK") nok++;
      else if (v === "N/A") na++;
    }
    return { ok, nok, na };
  }

  function updateSummary(fw) {
    const pct = calcPct(fw);
    const elPct = document.getElementById("pct-" + fw);
    const elAder = document.getElementById("ader-" + fw);
    if (pct === null) {
      elPct.textContent = "N/A";
      elPct.className = "cl-summary-val na";
      elAder.textContent = "N/A";
      elAder.className = "cl-summary-val na";
    } else {
      elPct.textContent = (pct * 100).toFixed(0) + "%";
      elPct.className = "cl-summary-val";
      const aderente = pct >= THRESHOLD;
      elAder.textContent = aderente ? "Aderente" : "Não aderente";
      elAder.className = "cl-summary-val " + (aderente ? "aderente" : "nao-aderente");
    }
  }

  function drawDonut(svgId, ok, nok, na) {
    const total = ok + nok + na;
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.replaceChildren();
    const cx = 50, cy = 50, r = 42;
    const circumference = 2 * Math.PI * r;
    if (total === 0) {
      const circle = document.createElement("circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "rgba(255,255,255,.12)");
      circle.setAttribute("stroke-width", "12");
      svg.appendChild(circle);
      return;
    }
    let offset = 0;
    const colors = ["#4ade80", "#f87171", "#fbbf24"];
    [ok, nok, na].forEach((n, i) => {
      if (n === 0) return;
      const pct = n / total;
      const dash = (pct * circumference) + " " + circumference;
      const circle = document.createElement("circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", colors[i]);
      circle.setAttribute("stroke-width", "12");
      circle.setAttribute("stroke-dasharray", dash);
      circle.setAttribute("stroke-dashoffset", -offset);
      svg.appendChild(circle);
      offset += pct * circumference;
    });
  }

  function updateDonut(fw) {
    const c = calcCounts(fw);
    document.getElementById("cnt-" + fw + "-ok").textContent = c.ok;
    document.getElementById("cnt-" + fw + "-nok").textContent = c.nok;
    document.getElementById("cnt-" + fw + "-na").textContent = c.na;
    drawDonut("donut-" + fw, c.ok, c.nok, c.na);
  }

  function updateResumo() {
    const fws = ["iso", "lgpd", "pci", "soc2", "devsecops", "fin", "govia"];
    const names = { iso: "ISO 27001", lgpd: "LGPD", pci: "PCI DSS", soc2: "SOC 2", devsecops: "DevSecOps", fin: "Finanças TI", govia: "Governança IA & Superinteligência" };
    fws.forEach(fw => {
      const pct = calcPct(fw);
      const el = document.getElementById("resumo-" + fw);
      const elLabel = document.getElementById("resumo-" + fw + "-label");
      if (pct === null) {
        el.textContent = "N/A";
        el.className = "cl-resumo-pct";
        elLabel.textContent = "—";
      } else {
        el.textContent = (pct * 100).toFixed(0) + "%";
        el.className = "cl-resumo-pct " + (pct >= THRESHOLD ? "verde" : "vermelho");
        elLabel.textContent = pct >= THRESHOLD ? "Aderente" : "Não aderente";
      }
    });
    const bar = document.getElementById("bar-resumo");
    bar.replaceChildren();
    fws.forEach(fw => {
      const pct = calcPct(fw);
      const v = pct === null ? 0 : pct;
      const row = document.createElement("div");
      row.className = "cl-bar-row";
      const name = document.createElement("span");
      name.className = "cl-bar-name";
      name.textContent = names[fw];
      const track = document.createElement("div");
      track.className = "cl-bar-track";
      const fill = document.createElement("div");
      fill.className = "cl-bar-fill";
      fill.style.width = (v * 100) + "%";
      track.appendChild(fill);
      const value = document.createElement("span");
      value.className = "cl-bar-val";
      value.textContent = pct === null ? "N/A" : (v * 100).toFixed(0) + "%";
      row.append(name, track, value);
      bar.appendChild(row);
    });
  }

  function initTabs() {
    document.querySelectorAll(".cl-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".cl-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".cl-panel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const id = tab.dataset.tab;
        document.getElementById("panel-" + id).classList.add("active");
      });
    });
  }

  function init() {
    loadState();
    renderTable("iso", "tbody-iso");
    renderTable("lgpd", "tbody-lgpd");
    renderTable("pci", "tbody-pci");
    renderTable("soc2", "tbody-soc2");
    renderTable("devsecops", "tbody-devsecops");
    renderTable("fin", "tbody-fin");
    renderTable("govia", "tbody-govia");
    ["iso", "lgpd", "pci", "soc2", "devsecops", "fin", "govia"].forEach(fw => {
      updateSummary(fw);
      updateDonut(fw);
    });
    updateResumo();
    initTabs();
  }

  document.getElementById("btn-save").addEventListener("click", () => {
    saveState();
    alert("Dados salvos no navegador.");
  });

  document.getElementById("btn-clear").addEventListener("click", () => {
    if (confirm("Limpar todos os dados? Esta ação não pode ser desfeita.")) {
      state = { iso: {}, lgpd: {}, pci: {}, soc2: {}, devsecops: {}, fin: {}, govia: {} };
      saveState();
      init();
    }
  });

  document.getElementById("btn-pdf").addEventListener("click", () => {
    generatePdf();
  });

  function buildReportContent() {
    const fws = ["iso", "lgpd", "pci", "soc2", "devsecops", "fin", "govia"];
    const names = { iso: "ISO 27001", lgpd: "LGPD", pci: "PCI DSS", soc2: "SOC 2", devsecops: "DevSecOps", fin: "Finanças TI", govia: "Governança IA & Superinteligência" };
    const headers = {
      iso: ["Controle", "Descrição", "Status"],
      lgpd: ["Referência", "Requisito", "Status"],
      pci: ["Requisito", "Descrição", "Status"],
      soc2: ["Critério", "Descrição", "Status"],
      devsecops: ["Prática", "Descrição", "Status"],
      fin: ["Prática", "Descrição", "Status"],
      govia: ["Requisito", "Descrição", "Status"]
    };
    const pctStr = (pct) => pct === null ? "N/A" : (pct * 100).toFixed(0) + "%";
    const resultStr = (pct) => {
      if (pct === null) return "N/A";
      return pct >= THRESHOLD ? "Aderente" : "Não aderente";
    };

    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const pctAll = fws.map(fw => calcPct(fw));
    const totalOk = pctAll.filter(p => p !== null).length;
    const aderentes = pctAll.filter(p => p !== null && p >= THRESHOLD).length;

    const css = [
      "* { box-sizing: border-box; margin: 0; padding: 0; }",
      ".pdf-report { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 1.5; padding: 0 20px 32px; width: 100%; max-width: 800px; background: #fff; }",
      ".report-cover { text-align: center; padding: 36px 0 40px; border-bottom: 2px solid #1e3a5f; margin-bottom: 28px; page-break-inside: avoid; break-inside: avoid; }",
      ".report-cover h1 { font-size: 22px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }",
      ".report-cover .sub { font-size: 13px; color: #475569; margin-bottom: 16px; }",
      ".report-date { font-size: 11px; color: #64748b; }",
      ".exec-summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; page-break-inside: avoid; break-inside: avoid; }",
      ".exec-summary h2 { font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 12px; }",
      ".exec-summary p { color: #334155; font-size: 13px; line-height: 1.65; }",
      ".summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 32px; page-break-inside: avoid; break-inside: avoid; }",
      ".summary-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; text-align: center; page-break-inside: avoid; break-inside: avoid; }",
      ".summary-card h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: #64748b; margin-bottom: 8px; }",
      ".summary-card .pct { font-size: 28px; font-weight: 900; color: #0f172a; }",
      ".summary-card .pct.ok { color: #166534; }",
      ".summary-card .pct.nok { color: #991b1b; }",
      ".summary-card .result { font-size: 11px; font-weight: 700; margin-top: 6px; }",
      ".summary-card .result.aderente { color: #166534; }",
      ".summary-card .result.nao { color: #991b1b; }",
      ".section { margin-bottom: 28px; page-break-inside: avoid; break-inside: avoid; }",
      ".section h2 { font-size: 14px; font-weight: 800; color: #1e3a5f; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #cbd5e1; page-break-after: avoid; }",
      ".report-table { width: 100%; border-collapse: collapse; font-size: 11px; page-break-inside: auto; }",
      ".report-table tr { page-break-inside: avoid; break-inside: avoid; }",
      ".report-table th, .report-table td { padding: 8px 12px; text-align: left; border: 1px solid #e2e8f0; }",
      ".report-table th { background: #1e3a5f; color: #fff; font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; }",
      ".report-table td:nth-child(1) { font-weight: 600; color: #334155; width: 100px; }",
      ".report-table td:nth-child(3) { text-align: center; font-weight: 700; }",
      ".report-table .st-ok { color: #166534; }",
      ".report-table .st-nok { color: #991b1b; }",
      ".report-table .st-na { color: #92400e; }",
      ".footer-report { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b; text-align: center; page-break-inside: avoid; break-inside: avoid; }"
    ].join("\n");

    const create = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };

    const report = create("div", "pdf-report");
    const style = create("style");
    style.textContent = css;
    report.appendChild(style);

    const cover = create("div", "report-cover");
    cover.append(create("h1", "", "Relatório Executivo"), create("p", "sub", "Checklist de Segurança da Informação"), create("p", "report-date", date));
    report.appendChild(cover);

    const summary = create("div", "exec-summary");
    summary.appendChild(create("h2", "", "Sumário Executivo"));
    const summaryText = "Este relatório consolida a avaliação de aderência aos frameworks ISO 27001 (Annex A), LGPD (Lei 13.709/2018), PCI DSS v4.0, SOC 2 (Trust Service Criteria), práticas DevSecOps, Finanças TI (FinOps/ITFM) e Governança de IA & Superinteligência (Framework AIE, OSIC). O percentual de conformidade é calculado como itens OK dividido por (OK + Não OK), excluindo itens não aplicáveis. Aderência ≥ 80% é considerada Aderente. " + (totalOk === 0 ? "Nenhum framework foi avaliado ainda." : aderentes + " de " + totalOk + " frameworks avaliados apresentam aderência.");
    summary.appendChild(create("p", "", summaryText));
    report.appendChild(summary);

    const summaryGrid = create("div", "summary-grid");
    fws.forEach(fw => {
      const pct = calcPct(fw);
      const card = create("div", "summary-card");
      const pctClass = pct !== null && pct >= THRESHOLD ? "ok" : pct !== null ? "nok" : "";
      const resultClass = pct !== null && pct >= THRESHOLD ? "aderente" : pct !== null ? "nao" : "";
      card.append(create("h3", "", names[fw]), create("div", "pct " + pctClass, pctStr(pct)), create("div", "result " + resultClass, resultStr(pct)));
      summaryGrid.appendChild(card);
    });
    report.appendChild(summaryGrid);

    const allowedStatuses = new Set(["OK", "Não OK", "N/A"]);
    fws.forEach(fw => {
      const section = create("div", "section");
      section.appendChild(create("h2", "", names[fw]));
      const table = create("table", "report-table");
      const thead = create("thead");
      const headRow = create("tr");
      headers[fw].forEach(header => headRow.appendChild(create("th", "", header)));
      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = create("tbody");
      DATA[fw].forEach(([ref, desc], i) => {
        const rawValue = (state[fw] && state[fw][String(i)]) || "";
        const value = allowedStatuses.has(rawValue) ? rawValue : "";
        const statusClass = value === "OK" ? "st-ok" : value === "Não OK" ? "st-nok" : value === "N/A" ? "st-na" : "";
        const row = create("tr");
        row.append(create("td", "", ref), create("td", "", desc), create("td", statusClass, value || "—"));
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      section.appendChild(table);
      report.appendChild(section);
    });

    report.appendChild(create("div", "footer-report", "Vulcan Defense · Checklist de Segurança da Informação · " + date + " · ISO/IEC 27001:2022, LGPD, PCI DSS v4.0, SOC 2 (AICPA), OWASP DevSecOps, FinOps/ITFM, Governança IA & Superinteligência (Framework AIE)"));
    return report;
  }

  function generatePdf() {
    const btn = document.getElementById("btn-pdf");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Gerando PDF…";

    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;top:0;left:0;margin:0;padding:0;width:210mm;max-width:100%;background:#fff;z-index:99999;overflow:visible;";
    const el = buildReportContent();
    wrap.appendChild(el);

    document.body.appendChild(wrap);

    const filename = "relatorio-checklist-si-" + new Date().toISOString().slice(0, 10) + ".pdf";

    if (typeof html2pdf !== "undefined") {
      html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: filename,
        image: { type: "jpeg", quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
        pagebreak: { mode: "css", avoid: ["tr", ".section", ".summary-card", ".exec-summary", ".report-cover", ".footer-report"] }
      }).from(el).save().then(() => {
        if (wrap.parentNode) document.body.removeChild(wrap);
        btn.disabled = false;
        btn.textContent = originalText;
      }).catch(() => {
        if (wrap.parentNode) document.body.removeChild(wrap);
        btn.disabled = false;
        btn.textContent = originalText;
        openPrintReport();
      });
    } else {
      if (wrap.parentNode) document.body.removeChild(wrap);
      btn.disabled = false;
      btn.textContent = originalText;
      openPrintReport();
    }
  }

  function openPrintReport() {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    const doc = w.document;
    doc.documentElement.lang = "pt-BR";
    const meta = doc.createElement("meta");
    meta.charset = "UTF-8";
    doc.head.appendChild(meta);
    doc.title = "Relatório - Checklist SI";

    const report = buildReportContent();
    report.classList.remove("pdf-report");
    doc.body.appendChild(doc.importNode(report, true));

    const printStyle = doc.createElement("style");
    printStyle.textContent = "body{font-family:Arial,sans-serif;padding:24px;max-width:800px;margin:0 auto;color:#1a1a1a;}";
    doc.head.appendChild(printStyle);
    w.focus();
    setTimeout(() => w.print(), 300);
  }
  const gateEl = document.getElementById("cl-gate");
  if (gateEl && gateEl.classList.contains("hidden")) {
    init();
  } else {
    window.initChecklist = init;
  }
})();
