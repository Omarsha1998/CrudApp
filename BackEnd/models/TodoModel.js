const mssql = require('mssql');
const { poolPromise } = require('../app');
const dbUtils = require('../utils/dbUtils');


const TodoModel = {
  getTodos: async () => {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      const result = await request.query('SELECT * FROM todos');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },
  
  addTodo: async (task, description, CreatorCode, UpdatorCode) => {
    try {
      const pool = await poolPromise;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const result = await dbUtils.runInTransaction(pool, async (request) => {
        return request
          .input('task', mssql.NVarChar, task)
          .input('description', mssql.NVarChar, description)
          .input('CreatorCode', mssql.NVarChar, CreatorCode)
          .input('UpdatorCode', mssql.NVarChar, UpdatorCode)
          .input('CreatedAt', mssql.DateTime, createdAt)
          .input('UpdatedAt', mssql.DateTime, updatedAt)
          .query('INSERT INTO todos (task, description, CreatorCode, UpdatorCode, CreatedAt, UpdatedAt) VALUES (@task, @description, @CreatorCode, @UpdatorCode, @CreatedAt, @UpdatedAt)');
      });

      return result;
    } catch (error) {
      throw error;
    }
  },


  
  
  
  updateTodo: async (id, description, UpdatorCode) => {
    try {
      const pool = await poolPromise;
      const updatedAt = new Date().toISOString();

      const result = await dbUtils.runInTransaction(pool, async (request) => {
        return request
          .input('id', mssql.Int, id)
          .input('description', mssql.NVarChar, description)
          .input('UpdatorCode', mssql.NVarChar, UpdatorCode)
          .input('UpdatedAt', mssql.DateTime, updatedAt)
          .query('UPDATE todos SET description = @description, UpdatorCode = @UpdatorCode, UpdatedAt = @UpdatedAt WHERE id = @id');
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
  
  deleteTodo: async (id, UpdatorCode) => {
    try {
      const pool = await poolPromise;
      const result = await dbUtils.runInTransaction(pool, async (request) => {
        return request
          .input('id', mssql.Int, id)
          .input('UpdatorCode', mssql.NVarChar, UpdatorCode)
          .query('DELETE FROM todos WHERE id = @id');
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = TodoModel;
