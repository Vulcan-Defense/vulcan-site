/* Extraído de portfolio-servicos.html para permitir CSP sem 'unsafe-inline' em script-src. */
document.addEventListener("DOMContentLoaded", function(){
  var btn = document.getElementById("btn-pdf");
  if (btn) {
    btn.addEventListener("click", function(){
      if (typeof html2pdf === "undefined") {
        window.print();
        return;
      }
      var el = document.getElementById("commercial-pdf-document");
      if (!el) return;
      var overlay = document.querySelector(".grid-overlay");
      if (overlay) overlay.style.visibility = "hidden";
      document.body.classList.add("pdf-export");
      el.setAttribute("aria-hidden", "false");
      btn.disabled = true;
      btn.textContent = "Preparando documento...";
      var now = new Date();
      var monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(now);
      el.querySelectorAll("[data-pdf-date]").forEach(function(node) {
        node.textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
      });
      var opt = {
        margin: 0,
        filename: "Vulcan-Defense-Servicos-Gerenciados-" + now.toISOString().slice(0, 7) + ".pdf",
        image: { type: "jpeg", quality: 0.96 },
        html2canvas: { scale: 1.35, useCORS: true, letterRendering: true, backgroundColor: "#ffffff", windowWidth: 794 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
        pagebreak: { mode: ["css", "legacy"] }
      };
      function cleanup() {
        document.body.classList.remove("pdf-export");
        el.setAttribute("aria-hidden", "true");
        btn.disabled = false;
        btn.textContent = "Baixar documento comercial (PDF)";
        if (overlay) overlay.style.visibility = "";
      }
      setTimeout(function() {
        html2pdf().set(opt).from(el).save()
          .then(function() {
            cleanup();
          })
          .catch(function() {
            cleanup();
            window.print();
          });
      }, 600);
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

});
