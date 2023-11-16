const express = require('express');
const todoController = require('../controllers/TodoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/todos', authMiddleware.verifyToken, todoController.getTodos);
router.post('/todos', authMiddleware.verifyToken, todoController.addTodo);
router.put('/todos/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, todoController.updateTodo);
router.delete('/todos/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, todoController.deleteTodo);

module.exports = router;
