const senaInput = document.getElementById("sena-input");
const result = document.getElementById("result");
const senaListBody = document.getElementById("sena-list-body");

function showResult(message, type = "") {
  result.textContent = message;
  result.className = `result ${type}`.trim();
}

function validateInput(value) {
  const dezenas = value.trim().split(/\s+/).filter(Boolean);

  if (dezenas.length !== 6) {
    return { error: "Entre com 6 dezenas separadas por espaços." };
  }

  if (dezenas.some((dezena) => !/^\d+$/.test(dezena))) {
    return { error: "Use apenas números." };
  }

  const numeros = dezenas.map(Number);

  if (numeros.some((numero) => numero < 1 || numero > 60)) {
    return { error: "Os números devem estar entre 1 e 60." };
  }

  if (new Set(numeros).size !== numeros.length) {
    return { error: "Não é permitido repetir números." };
  }

  return {
    nros: numeros.map((numero) => String(numero).padStart(2, "0")).join(" "),
  };
}

function renderBalls(dezenas) {
  let ballsHtml = "";

  for (let i = 0; i < dezenas.length; i++) {
    ballsHtml += `<span class="sena-ball">${dezenas[i]}</span>`;
  }

  return ballsHtml;
}

function renderSenas(senas) {
  if (senas.length === 0) {
    senaListBody.innerHTML = "";
    showResult("Nenhum jogo cadastrado.", "success");
    return;
  }

  let senaRow = "";

  for (let i = 0; i < senas.length; i++) {
    const dezenas = senas[i].nros.split(" ");
    const balls = renderBalls(dezenas);
    senaRow += `<div class="sena-row-balls">${balls}</div>`;
  }

  senaListBody.innerHTML = senaRow;
}

async function loadSenas() {
  try {
    const response = await fetch("/senas");

    if (response.ok) {
      const senas = await response.json();
      renderSenas(senas);
    } else {
      showResult("Problemas ao carregar os jogos.", "error");
    }
  } catch (error) {
    showResult("Não foi possível conectar ao servidor.", "error");
  }
}

async function createSena() {
  const validation = validateInput(senaInput.value);

  if (validation.error) {
    showResult(validation.error, "error");
    return;
  }

  showResult("Cadastrando...", "loading");

  try {
    const response = await fetch("/senas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nros: validation.nros }),
    });

    if (response.ok) {
      senaInput.value = "";
      showResult("Jogo cadastrado com sucesso.", "success");
      loadSenas();
    } else {
      const data = await response.json();
      showResult(data.error || "Problemas ao salvar o jogo.", "error");
    }
  } catch (error) {
    showResult("Não foi possível conectar ao servidor.", "error");
  }
}

senaInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    showResult("");
    createSena();
  }
});

loadSenas();
