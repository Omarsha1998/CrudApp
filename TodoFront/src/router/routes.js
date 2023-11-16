
const routes = [
  
  {
    path: '/',
    name: 'Login',
    component: () => import('components/Login.vue'),
  },
  {
    path: '/TodoList',
    name: 'TodoList',
    component: () => import('pages/TodoList.vue'),
  },



]

export default routes
