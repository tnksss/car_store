export function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function parseNumero(valor) {
  const limpo = (valor || "").replace(/[^\d.,]/g, "");
  if (!limpo) return null;

  const padronizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo.replace(/\./g, "");

  const numero = parseFloat(padronizado);
  return isNaN(numero) ? null : numero;
}

export function formatarNumero(numero) {
  return numero.toLocaleString("pt-BR");
}

function resolverUrlFoto(caminho) {
  const url = caminho.trim();
  if (!url) return null;

  if (/^https?:/i.test(url)) {
    const matchDrive = url.match(/\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
    if (matchDrive && /drive\.google\.com/.test(url)) {
      return `https://lh3.googleusercontent.com/d/${matchDrive[1]}`;
    }
    return url;
  }

  return `fotos/${url}`;
}

export function extrairFotos(campoFotos) {
  return (campoFotos || "")
    .split(/[;\n|]+/)
    .map(resolverUrlFoto)
    .filter(Boolean);
}
