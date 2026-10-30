/* Formulário de contato compartilhado (home e página de contato).
   Validação no cliente, proteção anti-spam e estados acessíveis de envio. */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;
  var msgEl = document.getElementById("contact-form-msg");
  var btn = form.querySelector(".submit-btn");
  if (!msgEl || !btn) return;

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var defaultLabel = btn.textContent;

  function setMessage(text, type) {
    msgEl.textContent = text || "";
    msgEl.className = "form-msg" + (type ? " " + type : "");
  }

  function field(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setMessage("", "");

    var honeypot = field("_gotcha");
    if (honeypot && honeypot.value) {
      /* Bot: responde como sucesso sem enviar nada. */
      setMessage("Solicitação enviada. Retornaremos em breve.", "success");
      form.reset();
      return;
    }

    var nome = (field("nome") && field("nome").value || "").trim();
    var email = (field("email") && field("email").value || "").trim();

    if (nome.length < 2) {
      setMessage("Informe seu nome para continuarmos.", "error");
      if (field("nome")) field("nome").focus();
      return;
    }
    if (!EMAIL.test(email)) {
      setMessage("Informe um e-mail válido, por exemplo nome@empresa.com.br.", "error");
      if (field("email")) field("email").focus();
      return;
    }

    btn.disabled = true;
    btn.setAttribute("aria-busy", "true");
    btn.textContent = "Enviando…";

    var formData = new FormData(form);
    formData.append("_replyto", email);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          setMessage("Solicitação enviada. Retornaremos em breve.", "success");
          form.reset();
          return;
        }
        var detail = result.data && result.data.errors && result.data.errors[0] && result.data.errors[0].message;
        setMessage(detail || "Não foi possível enviar agora. Escreva para contato@vulcandefense.com.br.", "error");
      })
      .catch(function () {
        setMessage("Falha de conexão. Escreva para contato@vulcandefense.com.br.", "error");
      })
      .then(function () {
        btn.disabled = false;
        btn.removeAttribute("aria-busy");
        btn.textContent = defaultLabel;
      });
  });
})();
