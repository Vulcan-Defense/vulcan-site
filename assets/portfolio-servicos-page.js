/* Extraído de portfolio-servicos.html para permitir CSP sem 'unsafe-inline' em script-src. */
document.addEventListener("DOMContentLoaded", function(){
  var btn = document.getElementById("btn-pdf");
  if (btn) {
    btn.addEventListener("click", function(){
      if (typeof html2pdf === "undefined") {
        window.print();
        return;
      }
      var el = document.getElementById("portfolio-content");
      var overlay = document.querySelector(".grid-overlay");
      if (overlay) overlay.style.visibility = "hidden";
      document.body.classList.add("pdf-export");
      btn.disabled = true;
      btn.textContent = "Gerando PDF...";
      el.scrollIntoView({ behavior: "instant", block: "start" });
      var opt = {
        margin: 8,
        filename: "Vulcan-Defense-Portfolio-Servicos.pdf",
        image: { type: "jpeg", quality: 0.92 },
        html2canvas: { scale: 1, useCORS: true, letterRendering: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };
      setTimeout(function() {
        html2pdf().set(opt).from(el).save()
          .then(function() {
            document.body.classList.remove("pdf-export");
            btn.disabled = false;
            btn.textContent = "Baixar PDF";
            if (overlay) overlay.style.visibility = "";
          })
          .catch(function() {
            document.body.classList.remove("pdf-export");
            btn.disabled = false;
            btn.textContent = "Baixar PDF";
            if (overlay) overlay.style.visibility = "";
            window.print();
          });
      }, 400);
    });
  }

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var sections = document.querySelectorAll(".port-section");
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add("port-seen"); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    sections.forEach(function(s) { io.observe(s); });
  } else {
    document.querySelectorAll(".port-section").forEach(function(s) { s.classList.add("port-seen"); });
  }

  var slaBtns = document.querySelectorAll(".port-sla-switch button");
  var valorEls = document.querySelectorAll(".port-pacote .valor");
  var mult = { "48h": 1, "6h": 1.25, "1h": 1.6 };
  var baseValores = [];

  function fmt(n) {
    n = Math.round(n);
    if (n >= 1000) return "R$ " + Math.floor(n/1000) + "." + String(n % 1000).padStart(3,"0");
    return "R$ " + n;
  }
  function parseVal(t) {
    var m = t.match(/R\$\s*([\d.]+)\s*[–-]\s*R\$\s*([\d.]+)(\/mês)?/);
    if (m) return { lo: parseFloat(m[1].replace(/\./g,"")), hi: parseFloat(m[2].replace(/\./g,"")), sufix: m[3] || "" };
    var s = t.match(/R\$\s*([\d.]+)(\/mês)?/);
    if (s) return { lo: parseFloat(s[1].replace(/\./g,"")), hi: null, sufix: s[2] || "" };
    return null;
  }
  valorEls.forEach(function(el) {
    var txt = el.textContent;
    if (txt.indexOf("Sem custo") >= 0) baseValores.push({ fixed: txt }); else baseValores.push(parseVal(txt) || { fixed: txt });
  });
  function applySla(sla) {
    var k = mult[sla];
    valorEls.forEach(function(el, i) {
      var b = baseValores[i];
      if (b.fixed) { el.textContent = b.fixed; return; }
      if (b.hi !== null) el.textContent = fmt(b.lo * k) + " – " + fmt(b.hi * k) + (b.sufix || "");
      else el.textContent = fmt(b.lo * k) + (b.sufix || "");
    });
    slaBtns.forEach(function(b) { b.classList.toggle("active", b.getAttribute("data-sla") === sla); b.setAttribute("aria-pressed", b.getAttribute("data-sla") === sla); });
  }

  slaBtns.forEach(function(b) {
    b.addEventListener("click", function() { applySla(b.getAttribute("data-sla")); });
  });
  applySla("48h");
});
