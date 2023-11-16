import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import auth from './auth'
import todomodule from './todomodule'



export default store(function () {
  const Store = createStore({
    modules: {
      auth,
      todomodule,


    },

  })

  return Store
})
