const TodoModel = require('../models/TodoModel');

const TodoController = {
  getTodos: async (req, res) => {
    try {
      const todos = await TodoModel.getTodos();
      res.status(200).json(todos);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error Retrieving Data');
    }
  },
  
  addTodo: async (req, res) => {
    const { task, description, CreatorCode, UpdatorCode } = req.body;
    try {
      await TodoModel.addTodo(task, description, CreatorCode, UpdatorCode);
      res.status(201).json({ message: 'Todo Created Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating todo');
    }
  },
  
  updateTodo: async (req, res) => {
    const { id } = req.params;
    const { description, UpdatorCode } = req.body;
    try {
      const result = await TodoModel.updateTodo(id, description, UpdatorCode);
      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: `Todo with ID ${id} updated successfully.` });
      } else {
        res.status(404).json({ message: `Todo with ID ${id} not found.` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error updating todo with ID: ${id}`);
    }
  },
  
  deleteTodo: async (req, res) => {
    const { id } = req.params;
    const { UpdatorCode } = req.body;
    try {
      const result = await TodoModel.deleteTodo(id, UpdatorCode);
      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: `Todo with ID ${id} deleted successfully.` });
      } else {
        res.status(404).json({ message: `Todo with ID ${id} not found.` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting todo.');
    }
  },
};

module.exports = TodoController;
