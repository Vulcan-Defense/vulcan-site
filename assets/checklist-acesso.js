/* Extraído de checklist-seguranca.html para permitir CSP sem 'unsafe-inline' em script-src. */
(function () {
  const CHECKLIST_ACCESS_KEY = "vulcan_checklist_access";
  const FORMSPREE_ID = "xpqyggqj"; /* formulário checklist - separado do contato */

  function checkAccess() {
    try {
      const stored = sessionStorage.getItem(CHECKLIST_ACCESS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data && data.email && typeof data.email === "string") return data.email;
      }
    } catch (_) {}
    return null;
  }

  function grantAccess(email) {
    try {
      sessionStorage.setItem(CHECKLIST_ACCESS_KEY, JSON.stringify({ email: email.toLowerCase().trim() }));
    } catch (_) {}
  }

  function liberarAcesso(gate, email) {
    grantAccess(email);
    gate.classList.add("hidden");
    if (typeof window.initChecklist === "function") window.initChecklist();
  }

  async function enviarEmailBackground(email) {
    try {
      const res = await fetch("https://formspree.io/f/" + FORMSPREE_ID, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: email,
          _subject: "Cadastro checklist Vulcan Defense",
          _replyto: email,
        }),
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  function initGate() {
    const gate = document.getElementById("cl-gate");
    const form = document.getElementById("cl-gate-form");
    const emailInput = document.getElementById("cl-gate-email");
    const errorEl = document.getElementById("cl-gate-error");
    const submitBtn = document.getElementById("cl-gate-submit");

    const approved = checkAccess();
    if (approved) {
      gate.classList.add("hidden");
      return true;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = (emailInput.value || "").trim();
      if (!email) {
        errorEl.textContent = "Informe seu e-mail.";
        errorEl.classList.add("visible");
        return;
      }

      submitBtn.disabled = true;
      errorEl.classList.remove("visible");
      errorEl.textContent = "";

      liberarAcesso(gate, email);

      enviarEmailBackground(email);

      submitBtn.disabled = false;
    });

    return false;
  }

  if (!initGate()) {
    window.initChecklist = function () {
      init();
    };
  }
})();
