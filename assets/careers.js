(function () {
  "use strict";

  var form = document.getElementById("talent-form");
  var fileInput = document.getElementById("curriculo");
  var dropZone = document.getElementById("file-drop");
  var fileName = document.getElementById("file-name");
  var fileHelp = document.getElementById("file-help");
  var status = document.getElementById("talent-status");
  if (!form || !fileInput || !dropZone || !fileName || !fileHelp || !status) return;

  var submitButton = form.querySelector("button[type='submit']");
  var submitLabel = submitButton.querySelector("span");
  var maxFileSize = 3 * 1024 * 1024;
  var allowedExtensions = ["pdf", "docx"];

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "talent-status" + (type ? " is-" + type : "");
  }

  function fileExtension(name) {
    var parts = String(name || "").toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
  }

  function validateFile(file) {
    if (!file) return "Selecione seu currículo em PDF ou DOCX.";
    if (allowedExtensions.indexOf(fileExtension(file.name)) === -1) return "Formato não permitido. Envie somente PDF ou DOCX.";
    if (file.size > maxFileSize) return "O arquivo excede 3 MB. Comprima o currículo e tente novamente.";
    if (file.size === 0) return "O arquivo selecionado está vazio.";
    return "";
  }

  function updateFileState(file) {
    var error = validateFile(file);
    if (error) {
      fileName.textContent = "Selecionar currículo";
      fileHelp.textContent = error;
      dropZone.classList.add("has-error");
      return false;
    }
    dropZone.classList.remove("has-error");
    fileName.textContent = file.name;
    fileHelp.textContent = (file.size / 1024 / 1024).toFixed(2).replace(".", ",") + " MB · pronto para envio";
    setStatus("", "");
    return true;
  }

  fileInput.addEventListener("change", function () {
    updateFileState(fileInput.files[0]);
  });

  ["dragenter", "dragover"].forEach(function (eventName) {
    dropZone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach(function (eventName) {
    dropZone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropZone.classList.remove("is-dragging");
    });
  });
  dropZone.addEventListener("drop", function (event) {
    var files = event.dataTransfer && event.dataTransfer.files;
    if (!files || !files.length) return;
    var transfer = new DataTransfer();
    transfer.items.add(files[0]);
    fileInput.files = transfer.files;
    updateFileState(files[0]);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    setStatus("", "");
    if (!form.reportValidity()) return;
    if (!updateFileState(fileInput.files[0])) {
      setStatus(validateFile(fileInput.files[0]), "error");
      fileInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    submitLabel.textContent = "Enviando com segurança...";
    try {
      var endpoint = window.VULCAN_CAREERS_ENDPOINT || "/api/careers";
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      var payload = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(payload.message || "Não foi possível enviar a candidatura.");
      setStatus("Candidatura enviada. Obrigado por querer construir o futuro da defesa digital conosco.", "success");
      form.reset();
      fileName.textContent = "Selecionar currículo";
      fileHelp.textContent = "Arraste ou escolha um arquivo PDF ou DOCX — máximo 3 MB";
    } catch (error) {
      setStatus(error.message || "Falha de conexão. Tente novamente em alguns instantes.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      submitLabel.textContent = "Enviar candidatura";
    }
  });
})();
