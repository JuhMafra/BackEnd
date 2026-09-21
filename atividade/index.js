const readline = require("readline");

const {
filmesNaoAssistidos,
obterTitulos,
buscarPorId
} = require("./funcoes");

const catalogo = [
{
id: 1,
titulo: "Interestelar",
genero: "Ficção científica",
ano: 2014,
assistido: true
},
{
id: 2,
titulo: "O Senhor dos Anéis",
genero: "Fantasia",
ano: 2001,
assistido: false
},
{
id: 3,
titulo: "Matrix",
genero: "Ficção científica",
ano: 1999,
assistido: true
},
{
id: 4,
titulo: "Jurassic Park",
genero: "Aventura",
ano: 1993,
assistido: false
}
];

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

function mostrarMenu() {
console.log("\n===== CATÁLOGO DE FILMES =====");
console.log("1 - Filmes não assistidos");
console.log("2 - Mostrar títulos");
console.log("3 - Buscar filme por ID");
console.log("0 - Sair");
console.log("==============================");

rl.question("Escolha uma opção: ", (opcao) => {
switch (opcao) {
case "1":
console.log("\nFilmes não assistidos:");
console.log(filmesNaoAssistidos(catalogo));
mostrarMenu();
break;


  case "2":
    console.log("\nTítulos dos filmes:");
    console.log(obterTitulos(catalogo));
    mostrarMenu();
    break;

  case "3":
    rl.question("Digite o ID do filme: ", (id) => {
      const filme = buscarPorId(catalogo, Number(id));

      if (filme) {
        console.log("\nFilme encontrado:");
        console.log(filme);
      } else {
        console.log("\nFilme não encontrado.");
      }

      mostrarMenu();
    });
    break;

  case "0":
    console.log("\nPrograma encerrado.");
    rl.close();
    break;

  default:
    console.log("\nOpção inválida.");
    mostrarMenu();
}

});
}

mostrarMenu();
