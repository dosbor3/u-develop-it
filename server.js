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

// db.query(`SELECT * FROM candidates`, (err, rows) => { //request for all potential candidates
//   console.log(rows);
// });

//Query for a READ Operation 
db.query("SELECT * FROM candidates WHERE id = 1", (err, row) => {
  if (err) {
    console.log(err);
  }
  console.log(row);
});

// //Query for DELETE Operation
// db.query("DELETE FROM candidates WHERE id = ?", 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

//Query for CREATE Operation
// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});



// Default response for any other request (Not Found)
// **** ALWAYS PLACE THIS ROUTE LAST ****
//CATCHALL ROUTE WILL OVERRIDE ALL OTHERS
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
