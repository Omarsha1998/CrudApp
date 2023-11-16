<template>

<div>


  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; ">
    <div style="min-height: 400px; min-width: 450px;">
      <q-card  class="text-h6 text-center" > LOGIN
        <q-card-section >
          <q-form >
            <q-input v-model="username" standout="bg-black text-white" required label="Username" class="q-mb-md"></q-input>
            <q-input v-model="password" standout="bg-black text-white" required label="Password" type="password" class="q-mb-md"></q-input>
            <q-btn color="black" @click="loginUser"> LOGIN </q-btn>
            <q-btn color="gray" text-color="black" @click="registerDialog = true">Register</q-btn>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>


  <div>
    <q-dialog v-model="registerDialog" persistent>
      <q-card class="text-h6 text-center" style="min-width: 450px;"> Register
        <q-card-section >
          <q-form>
            <q-input v-model="newUsername" standout="bg-black text-white" label="Username" required class="q-mb-md"></q-input>
            <q-input v-model="newPassword" standout="bg-black text-white" label="Password" required type="password" class="q-mb-md"></q-input>
            <q-btn color="black" label="Register" @click="registerUser"></q-btn>
            <q-btn color="gray" text-color="black" label="Cancel" @click="registerDialog = false"></q-btn>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

</div>





</template>


<script>



export default {

  data() {
    return {

      registerDialog: false,
      username: '',
      password: '',
      newUsername: '',
      newPassword: '',

    };
  },





  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    token() {
      return this.$store.getters['auth/token'];
    },
    user() {
      return this.$store.getters['auth/user'];
    },
  },

  methods: {
    async loginUser() {
      const success = await this.$store.dispatch('auth/loginUser', {
        username: this.username,
        password: this.password,
      });

      if (success) {
        this.username = '';
        this.password = '';
        this.$router.push('/TodoList');
      } else {
        this.username = '';
        this.password = '';
      }
    },

    async registerUser() {
      const success = await this.$store.dispatch('auth/registerUser', {
        newUsername: this.newUsername,
        newPassword: this.newPassword,
      });

      if (success) {
        this.newUsername = '';
        this.newPassword = '';
        this.registerDialog = false;
      } else {
        this.newUsername = '';
        this.newPassword = '';
      }
    },


  },


};

</script>

