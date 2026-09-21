const filmesNaoAssistidos = (catalogo) => {
  return catalogo.filter((filme) => filme.assistido === false);
};

const obterTitulos = (catalogo) => {
  return catalogo.map((filme) => filme.titulo.toUpperCase());
};

const buscarPorId = (catalogo, id) => {
  return catalogo.find((filme) => filme.id === id);
};

module.exports = {
  filmesNaoAssistidos,
  obterTitulos,
  buscarPorId
};