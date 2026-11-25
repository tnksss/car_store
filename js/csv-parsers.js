import { normalizarTexto } from "./formatters.js";

export function parseCSV(texto) {
  const limpo = texto.replace(/^\uFEFF/, "");
  const linhas = [];
  let linhaAtual = [];
  let campo = "";
  let entreAspas = false;

  for (let i = 0; i < limpo.length; i++) {
    const char = limpo[i];

    if (entreAspas) {
      if (char === '"') {
        if (limpo[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          entreAspas = false;
        }
      } else {
        campo += char;
      }
    } else if (char === '"') {
      entreAspas = true;
    } else if (char === ",") {
      linhaAtual.push(campo);
      campo = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && limpo[i + 1] === "\n") i++;
      linhaAtual.push(campo);
      campo = "";
      linhas.push(linhaAtual);
      linhaAtual = [];
    } else {
      campo += char;
    }
  }

  if (campo !== "" || linhaAtual.length) {
    linhaAtual.push(campo);
    linhas.push(linhaAtual);
  }

  return linhas.filter((linha) => linha.some((celula) => celula.trim() !== ""));
}

export function converterParaVeiculos(linhas) {
  if (!linhas.length) return [];

  const cabecalhos = linhas[0].map(normalizarTexto);
  const veiculos = [];

  for (let i = 1; i < linhas.length; i++) {
    const carro = {};
    cabecalhos.forEach((chave, index) => {
      carro[chave] = (linhas[i][index] || "").trim();
    });

    if (!carro.nome) continue;

    const status = normalizarTexto(carro.ativo || "sim");
    const inativo = ["nao", "n", "0", "vendido"].includes(status);
    if (inativo) continue;

    veiculos.push(carro);
  }

  return veiculos;
}
