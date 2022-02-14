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



// Default response for any other request (Not Found)
// **** ALWAYS PLACE THIS ROUTE LAST ****
//CATCHALL ROUTE WILL OVERRIDE ALL OTHERS
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
