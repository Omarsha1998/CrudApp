// mutations.js
export default {
  SET_AUTHENTICATED(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  SET_USER_ID(state, UserID) {
    state.UserID = UserID;
  }
};
