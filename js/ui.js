import { CONFIG } from "./config.js";
import { parseNumero, formatarNumero, extrairFotos } from "./formatters.js";

function criarGaleria(fotos, nomeCarro) {
  const galeria = document.createElement("div");
  galeria.className = "gal";

  fotos.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${nomeCarro} foto ${index + 1}`;
    if (index > 0) img.loading = "lazy";
    galeria.appendChild(img);
  });

  return galeria;
}

function criarFichaTecnica(carro, kmFormatado) {
  const dl = document.createElement("dl");

  const adicionarItem = (rotulo, valor) => {
    if (!valor) return;
    const dt = document.createElement("dt");
    dt.textContent = rotulo;
    const dd = document.createElement("dd");
    dd.textContent = valor;
    dl.append(dt, dd);
  };

  adicionarItem("Ano", carro.ano);
  adicionarItem("Km", kmFormatado ? `${kmFormatado} km` : "");
  adicionarItem("Cor", carro.cor);
  adicionarItem("Câmbio", carro.cambio);
  adicionarItem("Opcionais", carro.opcionais);

  return dl.children.length ? dl : null;
}

function criarCardVeiculo(carro) {
  const preco = parseNumero(carro.preco);
  const km = parseNumero(carro.km);
  const fotos = extrairFotos(carro.fotos);

  const precoTexto = preco ? `R$ ${formatarNumero(preco)}` : "Consulte";
  const kmTexto = km !== null ? formatarNumero(km) : "";
  const tituloCompleto = carro.nome + (carro.ano ? ` ${carro.ano}` : "");

  const mensagemWa = `Olá! Vi o ${tituloCompleto}${preco ? ` por ${precoTexto}` : ""} e quero mais informações.`;

  const article = document.createElement("article");
  article.className = "car";

  if (fotos.length) {
    article.appendChild(criarGaleria(fotos, carro.nome));
    if (fotos.length > 1) {
      const hint = document.createElement("div");
      hint.className = "hint";
      hint.textContent = `${fotos.length} fotos. Deslize para o lado.`;
      article.appendChild(hint);
    }
  }

  const body = document.createElement("div");
  body.className = "body";

  const h2 = document.createElement("h2");
  h2.textContent = carro.nome;

  const priceDiv = document.createElement("div");
  priceDiv.className = "price";
  priceDiv.textContent = precoTexto;

  body.append(h2, priceDiv);

  const ficha = criarFichaTecnica(carro, kmTexto);
  if (ficha) body.appendChild(ficha);

  const linkWa = document.createElement("a");
  linkWa.className = "wa";
  linkWa.target = "_blank";
  linkWa.rel = "noopener";
  linkWa.textContent = "Chamar no WhatsApp";
  linkWa.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagemWa)}`;

  body.appendChild(linkWa);
  article.appendChild(body);

  return article;
}

export function renderizarLista(veiculos) {
  const container = document.getElementById("lista");
  container.innerHTML = "";

  if (!veiculos.length) {
    container.innerHTML = '<div class="msg">Nenhum veículo disponível no momento.</div>';
    return;
  }

  veiculos.forEach((carro) => {
    container.appendChild(criarCardVeiculo(carro));
  });
}

export function renderizarErro() {
  const container = document.getElementById("lista");
  container.innerHTML =
    '<div class="msg">Não foi possível carregar os veículos agora. Chame a gente no WhatsApp.</div>';
}
