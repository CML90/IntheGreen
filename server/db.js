const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'inthegreen'
});



app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
        session({
        key: "userId",
        secret: "IntheGreen",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
    }
}));


//COOKIE session
//check
app.get('/api/authorized', (req, res) => {
    if(req.session.user){
        console.log(req.session.user);
        const userInfo = req.session.user;
        res.send({userInfo});
    }else{
        res.send({message: 'User not authenticated'});
    }
});

//SIGNUP
app.post('/api/insertuser', (req,res) => {

    const username = req.body.name;
    const password = req.body.password;
    const email = req.body.email;

    const sqlSelect = "SELECT * FROM users_t WHERE username = ?"
    db.query(sqlSelect, [username, password], (err,result) => {

        if (err) {
            res.send({err: err});
        }

        if(result.length > 0){
            console.log(result);
            res.send({message: "Username already exists"});
        }else{
            console.log(result);
            const sqlInsert = "INSERT INTO users_t (Username,Password,Email) VALUES (?,?,?);"
            db.query(sqlInsert, [username, password, email], (err, result) => {
                //console.log(err);
                //console.log(result.insertId);
                req.session.user = {userId: result.insertId, username: username};
                //console.log(req.session.user);
                res.send(result);
            });
        }
    });
});

app.get('/api/signupGET', (req,res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false });
    }
});

//LOGIN
app.get('/api/loginGET', (req,res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false });
    }
});

app.post('/api/login', (req,res) => {
    const username = req.body.name;
    const password = req.body.password;

    const sqlSelect = "SELECT * FROM users_t WHERE username = ? and password = ?;"
    db.query(sqlSelect, [username, password], (err,result) => {

        if (err) {
            res.send({err: err});
        }

        if(result.length > 0){
            req.session.user = {userId: result[0].UserID, username: username};
            //console.log(result);
            //console.log(req.session.user);
            res.send(result);
        }else{
            res.send({message: "Wrong username password combination"});
        }
        
    });
});





/*MONTHLY*/
//insert monthly set
app.post('/api/SetnewUSer', (req, res) => {

    const id = req.body.userId;
    const income = req.body.income;
    const bills = req.body.bills;
    const savings = req.body.savings;
    const budget = req.body.budget;
    const daybudget = req.body.day;

    const sqlInsert ="INSERT INTO monthlyset (User,UpdateDate,Income,Bills, Budget, Save, DayBudget) VALUES (?,NOW(),?,?,?,?,?);"
    db.query(sqlInsert, [id, income, bills, budget, savings, daybudget], (err, result) => {
        console.log(err);
        //console.log(result.insertId);
        //console.log(req.session.user);
        res.send(result);
    });
});


//check
app.post('/api/getmonthlyset', (req,res) => {
    console.log(req.body);
    const userId = req.body.user.userId;
    const month = req.body.month;
    const year = req.body.year;
    const sqlSelect = " SELECT * FROM monthlyset WHERE User = ? AND MONTH(UpdateDate) = ? AND YEAR(UpdateDate) = ?;";
    db.query(sqlSelect, [userId, month, year], (err,result) => {

        if (err) {
            res.send({err: err});
        }else if( (result.length > 0)){
            console.log(result);
            res.send(result);
        }else{
            res.send({message: 'No result'});
        }
            

           // res.send({message: "Wrong username password combination"});
    });
});


//DAILY
app.post('/api/SetnewUserDay', (req,res) => {
    console.log(req.body);
    const userId = req.body.userId;
    const avail = req.body.avail;
    const budget = req.body.budget;

    const sqlInsert = "INSERT INTO dailystats (User, Spent, Avail, NewDayBudg, Date) VALUES (?,0,?,?,NOW());"
    db.query(sqlInsert, [userId, avail, budget])
});


app.listen(3001, () => {
    console.log("running on port 3001");
});