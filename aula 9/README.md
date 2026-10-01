# Gabarito - Aula 09: Projeto Final - API Completa com Autenticação JWT

Este gabarito apresenta a solução para o projeto final da Aula 09, que consiste em construir uma API completa, estruturada e segura, utilizando autenticação baseada em JSON Web Tokens (JWT) e integrando com um banco de dados PostgreSQL.

## Estrutura do Projeto

A estrutura de pastas foi organizada para promover a separação de responsabilidades, escalabilidade e manutenção.

```
gabaritos/Aula09/
├── src/
│   ├── controllers/
│   │   ├── authController.js   # Lógica de login e registro
│   │   └── tasksController.js    # Lógica de CRUD para tarefas
│   ├── db/
│   │   └── index.js            # Configuração da conexão com o PostgreSQL
│   ├── middlewares/
│   │   └── authMiddleware.js   # Middleware para verificar o token JWT
│   └── routes/
│       ├── authRoutes.js       # Rotas de autenticação (/login, /register)
│       └── tasksRoutes.js      # Rotas protegidas para tarefas
├── .env                        # Arquivo para variáveis de ambiente (NÃO ENVIAR PARA O GIT)
├── package.json
├── server.js                   # Configuração e definição do Express (rotas e middlewares)
└── start.js                    # Script de inicialização com detecção de ambiente (DEV/PROD)
```

> 💡 **Como executar o servidor com `start.js`:**
> O arquivo `start.js` permite alternar o ambiente de execução de forma simples e multiplataforma:
> - **Modo Desenvolvimento:** `node start.js --dev` *(ou `npm run dev`)*
> - **Modo Produção:** `node start.js --production` *(ou `npm start`)*
> - **Via `.env`:** Basta adicionar `NODE_ENV=production` ou `NODE_ENV=development` no arquivo `.env` e rodar `node start.js`.
> - **Modo Direto:** Você também pode rodar diretamente `node server.js`.

## Conceitos Aplicados

### 1. **Estrutura de Projeto Escalável**

- **`server.js`**: Configura a aplicação Express, middlewares globais (como `express.json()`), carrega as rotas e exporta o `app`.
- **`start.js`**: Ponto de entrada que importa o `app` e roda o `app.listen()` com logs do ambiente.
- **`src/routes/`**: Define os endpoints da API e os associa aos métodos dos controllers.
- **`src/controllers/`**: Contém a lógica de negócio. Cada função recebe `req` e `res`, interage com o banco de dados e envia a resposta.
- **`src/middlewares/`**: Contém funções que são executadas antes dos controllers. `authMiddleware.js` é o exemplo principal, protegendo rotas.
- **`src/db/`**: Centraliza a configuração da conexão com o banco de dados, permitindo que seja facilmente reutilizada.

### 2. **Autenticação com JWT (`jsonwebtoken`)**

- **Registro (`/register`)**:
  1. Recebe `username` and `password`.
  2. Usa `bcryptjs` para gerar um _hash_ da senha. **Nunca armazene senhas em texto plano!**
  3. Salva o `username` e o `password_hash` no banco de dados.
- **Login (`/login`)**:
  1. Recebe `username` and `password`.
  2. Busca o usuário no banco de dados pelo `username`.
  3. Compara a senha fornecida com o hash armazenado usando `bcrypt.compare()`.
  4. Se a senha for válida, gera um token JWT com `jwt.sign()`.
  5. O _payload_ do token inclui o ID do usuário (`userId`), que será usado para identificar o usuário nas requisições futuras.
  6. O token é assinado com um segredo (`JWT_SECRET`) que está armazenado nas variáveis de ambiente.
- **Middleware de Autenticação (`authMiddleware.js`)**:
  1. Extrai o token do cabeçalho `Authorization` (formato: `Bearer <token>`).
  2. Verifica se o token é válido e não expirou usando `jwt.verify()`.
  3. Se for válido, extrai o _payload_ (que contém o `userId`) e o anexa ao objeto `req` (`req.user`).
  4. Chama `next()` para passar a requisição para o próximo middleware ou para o controller da rota.
  5. Se o token for inválido ou não existir, retorna um erro `401 Unauthorized` ou `403 Forbidden`.

### 3. **Autorização**

- Após a autenticação, o `userId` está disponível em `req.user.userId`.
- Os controllers de tarefas (`tasksController.js`) usam esse `userId` em **todas** as queries SQL (`WHERE user_id = $...`) para garantir que um usuário só possa ver, criar, atualizar e deletar **suas próprias tarefas**. Isso impede que um usuário acesse os dados de outro.

### 4. **Variáveis de Ambiente (`dotenv`)**

- Informações sensíveis como credenciais do banco de dados e o segredo do JWT não são escritas diretamente no código.
- Elas são armazenadas em um arquivo `.env` e carregadas no processo do Node.js usando a biblioteca `dotenv`.
- O arquivo `.env` **deve** ser incluído no `.gitignore` para não ser enviado para o repositório.

## Como Executar

1. **Setup do Banco de Dados**:
   - Crie um banco de dados no PostgreSQL.
   - Execute o seguinte script SQL para criar as tabelas `users` e `tasks`:

     ```sql
     -- Tabela para armazenar os usuários
     CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         name VARCHAR(100) NOT NULL, -- Nome real/completo do usuário
         username VARCHAR(100) UNIQUE NOT NULL, -- Nome de usuário para login
         email VARCHAR(100) UNIQUE NOT NULL, -- Email do usuário
         password_hash VARCHAR(255) NOT NULL, -- Senha hasheada
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Tabela para armazenar as tarefas
     CREATE TABLE tasks (
         id SERIAL PRIMARY KEY,
         user_id INTEGER NOT NULL,
         title VARCHAR(255) NOT NULL,
         description TEXT,
         completed BOOLEAN DEFAULT FALSE,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

         -- Define a chave estrangeira que relaciona a tarefa a um usuário
         CONSTRAINT fk_user
             FOREIGN KEY(user_id)
             REFERENCES users(id)
             ON DELETE CASCADE -- Se um usuário for deletado, suas tarefas também serão.
     );

     -- Adiciona um índice na coluna user_id para otimizar consultas
     CREATE INDEX idx_tasks_user_id ON tasks(user_id);
     ```

2. **Instale as dependências**:

   ```bash
   npm install express pg jsonwebtoken bcryptjs dotenv
   ```

3. **Crie o arquivo `.env`**:
   - Na raiz do projeto `gabaritos/Aula09`, crie um arquivo chamado `.env` com o seguinte conteúdo, substituindo pelos seus dados:
     ```
     DB_USER=seu_usuario_do_pg
     DB_HOST=localhost
     DB_DATABASE=seu_banco_de_dados
     DB_PASSWORD=sua_senha_do_pg
     DB_PORT=5432
     JWT_SECRET=seu_segredo_super_secreto_para_jwt
     ```

4. **Inicie o servidor**:

   ```bash
   node server.js
   ```

5. **Use o Postman ou similar para testar**:
   - **POST /auth/register**: Crie um novo usuário.
   - **POST /auth/login**: Faça login para obter um token JWT.
   - **GET /tasks**: Adicione o token no cabeçalho `Authorization: Bearer <seu_token>` para listar suas tarefas.
   - Teste as outras rotas de tarefas (`POST`, `PUT`, `DELETE`) sempre enviando o token.

### Executando com `nodemon` vs. `node --watch`

Para facilitar o desenvolvimento, este projeto está configurado para usar o `nodemon`, uma ferramenta que reinicia automaticamente o servidor sempre que detecta uma alteração nos arquivos.

**Nodemon:**

- **Como usar?** Execute o comando `npm run dev`.
- **O que faz?** Ele monitora todos os arquivos do projeto e reinicia o processo `node server.js` ao salvar uma alteração.
- **Vantagem:** É uma ferramenta muito popular, robusta e configurável. Funciona bem em uma grande variedade de projetos.

**Node.js `--watch` flag:**

- **Como usar?** Você poderia executar `node --watch server.js`.
- **O que faz?** É uma funcionalidade nativa do Node.js (versões mais recentes) que também reinicia o processo quando um arquivo importado é alterado.
- **Quando usar um ou outro?**
  - **`nodemon`** é uma dependência de desenvolvimento (`devDependency`) e é o padrão em muitos projetos legados e atuais. É uma aposta segura e já está configurado neste gabarito.
  - **`--watch`** é ótimo por ser nativo (não precisa instalar nada a mais), mas pode ser menos flexível que o `nodemon` em cenários complexos. Para este projeto, ambos funcionariam de forma semelhante.

Em resumo, `npm run dev` (com `nodemon`) é a forma recomendada para executar este projeto durante o desenvolvimento.
