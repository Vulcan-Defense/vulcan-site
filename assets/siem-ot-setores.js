(function () {
  "use strict";

  var sectors = {
    ferroviario: {
      code: "01", kicker: "Mobilidade e transporte", title: "Ferroviário",
      text: "Proteção de centros de controle, sinalização, telecomunicações, estações e ativos embarcados, com monitoramento que respeita disponibilidade e segurança operacional.",
      focus: ["SOC e MDR com contexto operacional", "Segmentação entre TI, OCC e campo", "Resposta coordenada sem interromper a operação"]
    },
    energia: {
      code: "02", kicker: "Geração, transmissão e distribuição", title: "Energia",
      text: "Visibilidade sobre redes corporativas e ambientes de automação, correlacionando eventos de subestações, centros de operação, acessos remotos e sistemas críticos.",
      focus: ["Inventário e risco de ativos OT", "Monitoramento de SCADA, IEDs e gateways", "Controles alinhados à IEC 62443 e NIST"]
    },
    industria: {
      code: "03", kicker: "Produção e manufatura", title: "Indústria",
      text: "Detecção e resposta para plantas conectadas, linhas de produção e engenharia, com foco na continuidade do processo, propriedade intelectual e cadeia de fornecedores.",
      focus: ["Proteção de PLCs, HMIs e estações de engenharia", "Threat hunting em TI e OT", "Hardening e gestão contínua de vulnerabilidades"]
    },
    infraestrutura: {
      code: "04", kicker: "Serviços essenciais", title: "Infraestrutura",
      text: "Arquitetura e operação de segurança para ativos de alta criticidade, combinando observabilidade, gestão de incidentes e planos de recuperação orientados ao risco.",
      focus: ["NOC + observabilidade 24x7", "Gestão de dependências e exposição", "Planos de contingência e recuperação"]
    },
    publico: {
      code: "05", kicker: "Governo e serviços ao cidadão", title: "Setor público",
      text: "Proteção de dados, serviços digitais e infraestruturas governamentais com governança, evidências de conformidade e capacidade de resposta a incidentes.",
      focus: ["GRC, LGPD e políticas de segurança", "SOC, investigação e forense", "Arquitetura resiliente para serviços públicos"]
    }
  };

  var tabs = document.querySelectorAll("[data-sector]");
  var detail = document.querySelector("[data-sector-detail]");
  if (!tabs.length || !detail) return;

  function render(key) {
    var item = sectors[key];
    if (!item) return;
    detail.dataset.code = item.code;
    detail.querySelector("[data-sector-kicker]").textContent = item.kicker;
    detail.querySelector("[data-sector-title]").textContent = item.title;
    detail.querySelector("[data-sector-text]").textContent = item.text;
    detail.querySelector("[data-sector-focus]").innerHTML = item.focus.map(function (line) { return "<li>" + line + "</li>"; }).join("");
    tabs.forEach(function (tab) {
      var active = tab.dataset.sector === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  }

  tabs.forEach(function (tab) { tab.addEventListener("click", function () { render(tab.dataset.sector); }); });
})();
