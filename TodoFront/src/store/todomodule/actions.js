import axios from 'axios';
import { Cookies } from 'quasar';
let api = process.env.API_HOST;

export default {
  async fetchTodos({ commit }) {

    try {
      const response = await axios.get(`${api}/task/todos`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        commit('SET_TODOS', data);
      } else {
        console.log('ERROR');
      }
    } catch (error) {
      console.error('ERROR', error);
    }
  },

  async addTodo({ commit }, newTodo) {
    try {
      const response = await axios.post(`${api}/task/todos`, newTodo, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      if (response.status === 201) {
        const addedTodo = response.data;
        commit('ADD_TODO', addedTodo);
        console.log('Success adding todo');

      } else {
        console.log('Failed to add new todo');
      }
    } catch (error) {
      console.error('Error adding todo', error);
    }
  },

  async editTodo({ commit }, updatedTodo) {
    try {
      const response = await axios.put(`${api}/task/todos/${updatedTodo.id}`, updatedTodo, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      if (response.status === 200) {
        const editedTodo = response.data;
        commit('UPDATE_TODO', editedTodo);
        console.log('Success editing todo');
      } else {
        console.log('Failed editing todo');
      }
    } catch (error) {
      console.error('Error editing todo', error);
    }
  },

  async deleteTodo({ commit }, id) {
    try {
      await axios.delete(`${api}/task//todos/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      commit('DELETE_TODO', id);
      console.log('Deleted Successfully');
    } catch (error) {
      console.log('Error Deleting todo', error);
    }
  },




};
