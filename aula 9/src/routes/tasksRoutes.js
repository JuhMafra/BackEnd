// src/routes/tasksRoutes.js
const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const authMiddleware = require("../middlewares/authMiddleware");

// Todas as rotas de tarefas são protegidas pelo middleware de autenticação
router.use(authMiddleware);

// Rota para listar todas as tarefas do usuário
router.get("/", tasksController.getAllTasks);

// Rota para buscar uma tarefa específica por ID
router.get("/:id", tasksController.getTaskById);

// Rota para criar uma nova tarefa
router.post("/", tasksController.createTask);

// Rota para atualizar uma tarefa
router.put("/:id", tasksController.updateTask);

// Rota para deletar uma tarefa
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
