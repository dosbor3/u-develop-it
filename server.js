const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const mysql = require("mysql2");

//connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'dj!sql4#G',
    database: 'election'
  },
  console.log('Connected to the election database.')
);

//request for all potential candidates
// Get all candidates
// Instead of logging the error, we'll send a status code of 500 and place 
// the error message within a JSON object. This will all be handled within 
// the error-handling conditional. The 500 status code indicates a server 
// error—different than a 404, which indicates a user request error. The 
// return statement will exit the database call once an error is encountered.
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT * FROM candidates`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Let's analyze the route. Here we're using the get() route method again. This time, 
// the endpoint has a route parameter that will hold the value of the id to specify 
// which candidate we'll select from the database.

// In the database call, we'll assign the captured value populated in the req.params 
// object with the key id to params. The database call will then query the candidates 
// table with this id and retrieve the row specified. Because params can be accepted in 
// the database call as an array, params is assigned as an array with a single element, req.params.id.

// The error status code was changed to 400 to notify the client that their request wasn't 
// accepted and to try a different request. In the route response, we'll send the row back to 
// the client in a JSON object.

// Get a single candidate
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
});
});

//Query for CREATE Operation
// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });



// Default response for any other request (Not Found)
// **** ALWAYS PLACE THIS ROUTE LAST ****
//CATCHALL ROUTE WILL OVERRIDE ALL OTHERS
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
