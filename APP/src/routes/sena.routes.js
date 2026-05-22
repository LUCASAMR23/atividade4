const express = require("express");
const { listSenas, createSena } = require("../database/senas");

const router = express.Router();

function validateSena(nros) {
  if (typeof nros !== "string") {
    return { error: "Informe as dezenas como texto." };
  }

  const dezenas = nros.trim().split(/\s+/).filter(Boolean);

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

  const normalized = numeros
    .map((numero) => String(numero).padStart(2, "0"))
    .join(" ");

  return { nros: normalized };
}

router.get("/", async function(req, res) {
  try {
    const response = await listSenas();
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json({ error: "Problemas ao carregar os jogos." });
  }
});

router.post("/", async function(req, res) {
  try {
    const validation = validateSena(req.body.nros);

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const response = await createSena(validation.nros);
    res.status(201).json(response.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Problemas ao salvar o jogo." });
  }
});

module.exports = router;
