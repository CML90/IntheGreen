const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'testforbudget'
});

app.get('/', (req,res) => {
    const sqlInsert = "INSERT INTO categories (ID,Category) VALUES (4,'Gifts');"
    db.query(sqlInsert, (err, result) => {
        res.send("hello world");
    });
    
});
//it workss, must erase and put actual one na

app.listen(3001, () => {
    console.log("running on port 3001");
});