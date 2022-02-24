const express = require('express'); //import the express server
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;  //use environment port and if not available use 3001 port
const app = express();  //creating an instance of the express object

const cTable = require('console.table');

const mysql = require('mysql2');  //import the mysql database
const { result } = require('lodash');
const router = require('./routes/apiRoutes/candidateRoutes');

app.use(express.urlencoded({ extended: false }));//to parse raw data to key/value pairs
app.use(express.json());  //takes the POST data in the form of JSON and parses it into the req.body JS object

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password2',
    database: 'election'
  },
  console.log('Connected to the election database.')
);

// //Test the connection
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Hello World'
//   });
// });

// //query selects all records from the candidates table and prints a table to the console (console.table)
//   db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.table(rows);
//   });

//GET route for retrieving all candidates from the database and sending to server
//
  app.get('/api/candidates', (req, res) => {
    const sql = 'SELECT * FROM candidates';

    db.query(sql, (err, rows) => {
      if(err) {
        res.status(500).json({error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

  
// //query selects the first record from the candidates table based on id and prints a table to the console (console.table)
// db.query('SELECT * FROM candidates WHERE id = 1', (err, res) => { //notice the callback function parameters can be named whatever I want them to be!!
//   if (err) {
//     console.log(err);
//   }  
//   else 
//   console.table(res);
// });

//GET route for retrieving a single candidate from the database and sending to server
app.get('/api/candidate/:id', (req, res) => {
  const sql = 'SELECT * FROM candidates WHERE id = ?';
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if(err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  }) ;
});

//GET route for deleting a single candidate from the database and sending results to server
app.delete('/api/candidate/:id', (req, res) => {
  const sql = 'DELETE FROM candidates WHERE id = ?';
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if(err) {
      res.statusMessage(400).json({ error: res.message });
    }
    else if (!result.affectedRows) {
      res.json({message: 'Candididate NOT found!'});
    }
    else {
      res.json({
        message: 'Candidate Delete Successful',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// // Create---> INSERT is the sql command.....
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [4, 'Russell', 'Banks', 0];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

//POST route for a candidate ` Creating a route to create a candidate
//We're using the object destructuring to pull the body property out of the request object
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if(errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = 'INSERT INTO candidates(first_name, last_name, industry_connected) VALUES (?, ?, ?)';
  const params =[body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, results) => {
    if(err) {
      res.status(400).json({ error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

//PUT Route ~ update candidates
app.put('/api/candidate/:id', (req, res) => {
  // // Data validation
  // const errors = inputCheck(req.body, 'last_name');
  // if (errors) {
  //   res.status(400).json({ error: errors });
  //   return;
  // }

  const sql = `UPDATE candidates SET last_name = ? WHERE id = ?`;
  const params = [req.body.last_name, req.params.id];
  console.log(params);

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({ message: 'Candidate not found' });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// //query DELETES the first record from the candidates tables based on id ~ prepared statement due to the question mark as a placeholder
// db.query(`DELETE FROM candidates WHERE id = ?`, 4, (errors, response) => {
//   if (errors) {
//     console.log('Deletion Incomplete, as candidate not found!')
//   }
//   console.table(response);
// });

app.delete('/candidates:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;

  db.query(sql, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
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

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});



//Starts the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});