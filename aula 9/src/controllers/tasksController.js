// src/controllers/tasksController.js
const db = require("../db");

// GET /tasks - Listar todas as tarefas do usuário logado
exports.getAllTasks = async (req, res) => {
  const userId = req.user.userId; // ID do usuário vem do middleware de autenticação

  try {
    const { rows } = await db.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao buscar tarefas." });
  }
};

// GET /tasks/:id - Buscar uma tarefa específica do usuário logado
exports.getTaskById = async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  try {
    const { rows } = await db.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId],
    );
    const task = rows[0];

    if (!task) {
      return res
        .status(404)
        .send({
          error: "Tarefa não encontrada ou não pertence a este usuário.",
        });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao buscar a tarefa." });
  }
};

// POST /tasks - Criar uma nova tarefa para o usuário logado
exports.createTask = async (req, res) => {
  const userId = req.user.userId;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).send({ error: "O título da tarefa é obrigatório." });
  }

  try {
    const { rows } = await db.query(
      "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, description],
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao criar a tarefa." });
  }
};

// PUT /tasks/:id - Atualizar uma tarefa do usuário logado
exports.updateTask = async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  const { title, description, completed, due_date } = req.body;

  if (!title) {
    return res.status(400).send({
      error: "O título não pode ser vazio.",
    });
  }

  try {
    const { rows } = await db.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           completed = $3,
           due_date = $4
       WHERE id = $5
       AND user_id = $6
       RETURNING *`,
      [title, description, completed, due_date, taskId, userId],
    );

    const updatedTask = rows[0];

    if (!updatedTask) {
      return res.status(404).send({
        error: "Tarefa não encontrada ou não pertence a este usuário.",
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Erro ao atualizar a tarefa.",
    });
  }
};


// DELETE /tasks/:id - Deletar uma tarefa do usuário logado
exports.deleteTask = async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .send({
          error: "Tarefa não encontrada ou não pertence a este usuário.",
        });
    }

    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao deletar a tarefa." });
  }
};
