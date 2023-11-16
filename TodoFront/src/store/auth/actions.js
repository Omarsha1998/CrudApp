// actions.js
import axios from 'axios';
import { Cookies } from 'quasar';
let api = process.env.API_HOST;

export default {
  async loginUser({ commit }, { username, password }) {
    if (!username || !password) {
      console.log('Username and Password are required!');
      return false;
    }

    try {
      const response = await axios.post(`${api}/user/login`, {
        username,
        password,
      });

      Cookies.set('token', response.data.token);
      commit('SET_AUTHENTICATED', true);
      commit('SET_TOKEN', response.data.token);
      commit('SET_USER', response.data.user);

      console.log('Login Successful');
      return true;
    } catch (error) {
      console.error('Login Failed', error);
      return false;
    }
  },

  async registerUser(_, { newUsername, newPassword }) {
    if (!newUsername || !newPassword) {
      console.log('Username and Password are required!');
      return false;
    }

    try {
      await axios.post(`${api}/user/register`, {
        username: newUsername,
        password: newPassword,
      });

      console.log('Register Successful');
      return true;
    } catch (error) {
      console.error('Register Failed', error);
      return false;
    }
  },

  async logoutUser({ commit }) {
    try {
      await axios.post(`${api}/user/logout`, {}, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });

      Cookies.remove('token');
      commit('SET_AUTHENTICATED', false);
      commit('SET_TOKEN', null);
      commit('SET_USER', null);

      console.log('Logout Successfull');
    } catch (error) {
      console.error('Logout Failed', error);
    }
  },


  async fetchUserData({ commit }) {
    try {
      const token = Cookies.get('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
  
        const username = payload.username;
        const userId = payload.UserID; 
  
        commit('SET_USER', username);
        commit('SET_USER_ID', userId); 
      }
    } catch (error) {
      console.error('Error getting username and UserID from JWT', error);
    }
  }
  

}
