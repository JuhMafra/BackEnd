const http = require ("http");
const server = http.createServer((req,res) => {

const usuarios = [

    {
        id:2,
        nome: "Mariaaaa"

    },

    {
        id: 3,
        nome: "Pedro"
    }
]    


if(req.url === "/"){
    res.end("Bem vindo a essa bagaçaaaa");
}

if(req.url === "/usuarios"){
res.setHeader("Content-Type","application/json");
res.end(JSON.stringify(usuarios));
}

});

server.listen(3000);