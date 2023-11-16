
<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>User</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" side="left" bordered>
        <q-item full-width clickable @click="showTodoList" >
            <q-icon name="list" size="30px" class="q-mr-md" />
            <span class="text-h6">Todo List</span>
        </q-item>

        <q-item full-width clickable @click="goToAddTask" >
            <q-icon name="add" size="30px" class="q-mr-md" />
            <span class="text-h6">Add Task</span>
        </q-item>


        <q-item full-width>
        <q-item-section>
          <q-btn color="blue" text-color="white" @click="logoutUser" label="Logout"/>
        </q-item-section>
      </q-item>

      </q-drawer>

      <q-page-container>
        <div v-if="currentView === 'todoAdd'">
          <h4 style="display: flex; justify-content: center; margin-bottom: 10px;">Todo Add</h4>
          <div style="display: flex; justify-content: center;">
            <q-btn @click="addDialog = true" color="blue">Add Task</q-btn>
              <q-dialog v-model="addDialog" >
                <q-card style="min-width: 450px;">
                  <q-card-section>
                    <div class="text-h5 text-center" style="margin-bottom: 20px;">ADD TASK</div>
                    <q-form class="q-mb-md">
                      <q-input v-model="task" standout="bg-blue text-white" label="Task" required class="q-mb-xs"/>
                      <q-input v-model="description" standout="bg-blue text-white" label="Description" required class="q-mb-xs"/>
                      <q-input v-model="CreatorCode" standout="bg-blue text-white" label="Creator Code/ID" required class="q-mb-xs"/>
                      <q-input v-model="UpdatorCode" standout="bg-blue text-white" label="Updator Code/ID" required class="q-mb-xs"/>
                    </q-form>


                      <q-btn @click="addTodo" color="blue">Add Task</q-btn>
                      <q-btn @click="addDialog = false" color="red" class="q-ml-sm">Cancel</q-btn>

                  </q-card-section>
                </q-card>
              </q-dialog>
          </div>
        </div>


        <div v-if="currentView === 'todoList'">
          <h2 style="text-align: center; margin-bottom: 10px;">Todo's List</h2>

          <div>
            <div class="q-pa-md text-h6 text-center">Todos:</div>
              <q-table class="rounded-custom" :rows="todos" :columns="columns" row-key="id" virtual-scroll :pagination="false" >
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn @click="editTask(props.row)" icon="edit" color="primary" class="q-mr-xs" />
                    <q-btn @click="deleteTodo(props.row.id)" icon="delete" color="negative" />
                  </q-td>
                </template>
              </q-table>

              <q-dialog v-model="editDialog">
                <q-card style="min-width: 450px;">
                  <q-card-section>
                    <div class="text-h5 text-center" style="margin-bottom: 20px;">EDIT TASK</div>
                    <q-form class="q-mb-md">
                      <q-input v-model="newDescription" standout="bg-blue text-white" label="Description" required class="q-mb-xs" />
                      <q-input v-model="newUpdatorCode" standout="bg-blue text-white" label="Updator Code/ID" required class="q-mb-xs" />
                    </q-form>

                    <q-card-actions class="q-mb-md">
                      <q-btn @click="editTodo" color="primary">Save</q-btn>
                      <q-btn @click="cancelEdit" color="negative" class="q-ml-sm">Cancel</q-btn>
                    </q-card-actions>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
        </div>


      </q-page-container>
    </q-layout>
  </div>
</template>



<script>


export default {



  data() {
    return {
      leftDrawerOpen: false,
      addDialog: false,
      currentView: '',
      userAccount: '123',
      todos: [],
      editDialog: false,
      task: '',
      description: '',
      CreatorCode: '',
      UpdatorCode: '',
      newDescription: '',
      newUpdatorCode: '',
      editedTodoId: '',

      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
        { name: 'task', label: 'Task', align: 'left', field: 'task', sortable: true },
        { name: 'description', label: 'Description', align: 'left', field: 'description', sortable: true },
        { name: 'CreatorCode', label: 'Creator Code', align: 'left', field: 'CreatorCode', sortable: true },
        { name: 'CreatedAt', label: 'Created At', align: 'left', field: 'CreatedAt', sortable: true, format: (val) => this.formatDateTime(val) },
        { name: 'UpdatorCode', label: 'Updator Code', align: 'left', field: 'UpdatorCode', sortable: true },
        { name: 'UpdatedAt', label: 'Updated At', align: 'left', field: 'UpdatedAt', sortable: true, format: (val) => this.formatDateTime(val) },
        { name: 'actions', label: 'Actions', align: 'center', field: 'id', sortable: false },
      ],
    };

  },










  methods: {





    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    showTodoList() {
      this.currentView = 'todoList';
    },

    goToAddTask() {
      this.currentView = 'todoAdd';
    },






    formatDateTime(dateTimeString) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },



    async fetchTodos() {
      try {
        await this.$store.dispatch('todomodule/fetchTodos');
        this.todos = this.$store.state.todomodule.todos;
        console.log('Success getting data')
      } catch (error) {
        console.log('Failed getting data', error)
      }
    },



    async addTodo() {

      if (!this.task || !this.description || !this.CreatorCode || !this.UpdatorCode) {
        console.log('Task, description, CreatorCode, and UpdatorCode are required.');
        return;
      }


      const todoPayload = {
        task: this.task,
        description: this.description,
        CreatorCode: this.CreatorCode,
        UpdatorCode: this.UpdatorCode,
      };


      try {
        await this.$store.dispatch('todomodule/addTodo', todoPayload);
        
        console.log('Success adding task');
        this.addDialog = false;
        this.task = '';
        this.description = '';
        this.CreatorCode = '';
        this.UpdatorCode = '';
        this.fetchTodos();
      } catch (error) {
        console.log('Failed to add a new task');
        this.addDialog = false;
      }
      },



      editTask(todo) {
      this.editedTodoId = todo.id;
      this.editDialog = true;
      this.newDescription = '';
      this.newUpdatorCode = '';
      },



      cancelEdit() {
      this.editedTodoId = null;
      this.editDialog = false;
      this.newDescription = '';
      this.newUpdatorCode = '';
      },


      async editTodo() {

      if (!this.newDescription || !this.newUpdatorCode) {
      console.log('description and UpdatorCode are required.');
      return;
      }
      const updatedTodo = {
      id: this.editedTodoId,
      description: this.newDescription,
      UpdatorCode: this.newUpdatorCode,
      };

      try {
        await this.$store.dispatch('todomodule/editTodo', updatedTodo);

        console.log('Success editing task');
        this.editDialog = false;
        this.newDescription = '';
        this.newUpdatorCode = '';
        this.fetchTodos();
      } catch (error) {
        console.log('Failed to editing task');
        this.addDialog = false;
      }

      },

      async deleteTodo(id) {

      try {
      await this.$store.dispatch('todomodule/deleteTodo', id);
      console.log('Success Deleting Task')
      this.fetchTodos();
      } catch (error) {
      console.log('Failed Deleting Task!')
      }

      },


      async logoutUser() {
      await this.$store.dispatch('auth/logoutUser');
      this.$router.push('/');
      },

      },

      created() {
        this.currentView = 'todoList';

      this.fetchTodos();
      },

      
};
</script>

<style scoped>
  .rounded-custom {
  max-width: 1200px;
  overflow-y: auto;
  margin: 0 auto;
  border-radius: 15px;
  padding-bottom: 10px;
}
</style>

