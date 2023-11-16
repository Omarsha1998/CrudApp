const bcrypt = require('bcrypt');
const { poolPromise } = require('../app');

const UserModel = {
  registerUser: async (username, password) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      const checkUserQuery = `SELECT * FROM Users WHERE Username = '${username}'`;
      const checkUserResult = await request.query(checkUserQuery);
      const existingUser = checkUserResult.recordset[0];

      if (existingUser) {
        return 'Username is already taken.';
      }


      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserQuery = `INSERT INTO Users (Username, Password) VALUES ('${username}', '${hashedPassword}')`;
      const insertResult = await request.query(insertUserQuery);

      if (insertResult.rowsAffected[0] === 1) {
        return 'User registered successfully!';
      } else {
        return 'Error registering user.';
      }
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (username, password) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();


      const result = await request.query(`SELECT * FROM Users WHERE Username = '${username}'`);
      const user = result.recordset[0];

      if (!user) {
        return 'Invalid username or password.';
      }


      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (passwordMatch) {
        return { username: user.Username, isAdmin: user.isAdmin };
      } else {
        return 'Invalid username or password.';
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserModel;
