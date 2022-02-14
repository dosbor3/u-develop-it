const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

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

//Query for a READ Operation 
// db.query("SELECT * FROM candidates WHERE id = 1", (err, row) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(row);
// });

// //Query for DELETE Operation
// db.query("DELETE FROM candidates WHERE id = ?", 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

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
