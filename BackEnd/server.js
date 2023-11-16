const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = 'your_hardcoded_jwt_secret';
const tokenBlacklist = new Set();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
  },
};

const poolPromise = new mssql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('authorization')?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Access denied.');
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).send('Token expired or invalid.');
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    req.user = user;
    next();
  });
}

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send('Access denied. Admin privileges required.');
  }
}

// Function to execute SQL queries within a transaction
async function executeQueryInTransaction(pool, query) {
  const transaction = new mssql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new mssql.Request(transaction);
    const result = await request.query(query);

    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// Route for user registration with a transaction
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      BEGIN TRAN
      IF NOT EXISTS (SELECT * FROM Users WHERE Username = '${username}')
      BEGIN
        INSERT INTO Users (Username, Password) VALUES ('${username}', '${hashedPassword}')
        COMMIT
      END
      ELSE
      BEGIN
        ROLLBACK
      END`;

    const result = await executeQueryInTransaction(pool, query);

    if (result.rowsAffected) {
      res.status(201).send('User registered successfully!');
    } else {
      res.status(400).send('Username is already taken.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user.');
  }
});

// Route for user login with a transaction
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;

    const query = `
      SELECT * FROM Users WHERE Username = '${username}'`;

    const userResult = await pool.request().query(query);
    const user = userResult.recordset[0];

    if (!user) {
      return res.status(401).send('Invalid username or password.');
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);

    if (passwordMatch) {
      const token = jwt.sign({ username: user.Username, isAdmin: user.isAdmin }, JWT_SECRET);
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
      res.status(200).json({ message: 'Login successful!', token });
    } else {
      res.status(401).send('Invalid username or password.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login.');
  }
});

// Route for user logout and token expiration
app.post('/logout', verifyToken, (req, res) => {
  const token = req.header('authorization')?.split(' ')[1];

  if (token) {
    tokenBlacklist.add(token);
    res.status(200).send('Logout successful.');
  } else {
    res.status(400).send('Invalid request.');
  }
});

// Route to get todos within a transaction
app.get('/todos', verifyToken, async (req, res) => {
  try {
    const pool = await poolPromise;

    const query = 'SELECT * FROM todos';

    const result = await executeQueryInTransaction(pool, query);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Retrieving Data');
  }
});

// Route to add todos within a transaction
app.post('/todos', verifyToken, async (req, res) => {
  try {
    const { task, description, CreatorCode, UpdatorCode } = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const pool = await poolPromise;

    const query = `
      BEGIN TRAN
      INSERT INTO todos (task, description, CreatorCode, UpdatorCode, CreatedAt, UpdatedAt)
      VALUES ('${task}', '${description}', '${CreatorCode}', '${UpdatorCode}', '${createdAt}', '${updatedAt}')
      COMMIT`;

    const result = await executeQueryInTransaction(pool, query);

    if (result.rowsAffected) {
      res.status(201).json({ message: 'Todo Created Success' });
    } else {
      res.status(500).send('Error creating todo');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating todo');
  }
});

// Route to edit or update todos within a transaction
app.put('/todos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { description, UpdatorCode } = req.body;
  const updatedAt = new Date().toISOString();

  try {
    const pool = await poolPromise;

    const query = `
      BEGIN TRAN
      UPDATE todos
      SET description = '${description}', UpdatorCode = '${UpdatorCode}', UpdatedAt = '${updatedAt}'
      WHERE id = ${id}
      COMMIT`;

    const result = await executeQueryInTransaction(pool, query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: `Todo with ID ${id} updated successfully.` });
    } else {
      res.status(404).json({ message: `Todo with ID ${id} not found.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error updating todo with ID: ${id}`);
  }
});

// Route to delete todos within a transaction
app.delete('/todos/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const query = `
      BEGIN TRAN
      DELETE FROM todos WHERE id = ${id}
      COMMIT`;

    const result = await executeQueryInTransaction(pool, query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: `Todo with ID ${id} deleted successfully.` });
    } else {
      res.status(404).json({ message: `Todo with ID ${id} not found.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting todo.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
