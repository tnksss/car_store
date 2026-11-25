import { CONFIG } from "./config.js";
import { parseCSV, converterParaVeiculos } from "./csv-parser.js";
import { renderizarLista, renderizarErro } from "./ui.js";

function inicializarCabecalhoRodape() {
  document.title = `${CONFIG.loja} | Veículos à venda`;
  document.getElementById("loja").textContent = CONFIG.loja;
  document.getElementById("loja-rodape").textContent = CONFIG.loja;

  const linkFone = document.getElementById("fone");
  linkFone.textContent = CONFIG.whatsappExibir;
  linkFone.href = `https://wa.me/${CONFIG.whatsapp}`;
}

async function buscarCSV(url) {
  const resposta = await fetch(url, { cache: "no-store" });
  if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
  return resposta.text();
}

async function iniciar() {
  inicializarCabecalhoRodape();

  try {
    let textoCSV;
    if (CONFIG.planilhaUrl) {
      try {
        textoCSV = await buscarCSV(CONFIG.planilhaUrl);
      } catch {
        textoCSV = await buscarCSV(CONFIG.arquivoLocal);
      }
    } else {
      textoCSV = await buscarCSV(CONFIG.arquivoLocal);
    }

    const linhas = parseCSV(textoCSV);
    const veiculos = converterParaVeiculos(linhas);
    renderizarLista(veiculos);
  } catch (erro) {
    console.error("Falha ao carregar estoque:", erro);
    renderizarErro();
  }
}

iniciar();
