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

});
