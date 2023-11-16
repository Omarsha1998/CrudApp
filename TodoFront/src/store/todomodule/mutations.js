export default {
  SET_TODOS(state, todos) {
    state.todos = todos;
  },
  ADD_TODO(state, todo) {
    state.todos.push(todo);
  },
  UPDATE_TODO(state, updatedTodo) {
    const index = state.todos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      state.todos[index] = updatedTodo;
    }
  },
  DELETE_TODO(state, id) {
    state.todos = state.todos.filter(todo => todo.id !== id);
  },


};
