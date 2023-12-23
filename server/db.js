const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'greenbudget'
});



app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//COOKIE session
//check

/**
 * @swagger
 * /api/authorized:
 *   get:
 *     summary: Get user information for an authorized user
 *     description: Retrieve information for an authorized user.
 *     responses:
 *       200:
 *         description: Successful retrieval of user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 */
app.get('/api/authorized', (req, res) => {
    console.log("authorized is running");
    if(req.session.user){
        console.log(req.session.user);
        const userInfo = req.session.user;
        res.send({userInfo});
    }else{
        res.send({message: 'User not authenticated'});
    }
});

//SIGNUP
/**
 * @swagger
 * /api/insertuser:
 *   post:
 *     summary: Insert a new user
 *     description: Inserts a new user into the database if the username is unique.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User inserted successfully
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Internal server error
 */
app.post('/api/insertuser', (req,res) => {
    console.log("insertuser is running");
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

/**
 * @swagger
 * /api/signupGET:
 *   get:
 *     summary: Get user information for signup
 *     description: Retrieves user information for a signup session.
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *       500:
 *         description: No user session found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 */
app.get('/api/signupGET', (req,res) => {
    console.log("signupGET is running");
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false });
    }
});

//LOGIN
/**
 * @swagger
 * /api/loginGET:
 *   get:
 *     summary: Get user information for login
 *     description: Retrieves user information for a login session.
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *       500:
 *         description: No user session found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 */
app.get('/api/loginGET', (req,res) => {
    console.log("loginGET is running");
    if(req.session.user){
        console.log(req.session.user);
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false });
    }
});


/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user based on the provided username and password.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 username:
 *                   type: string
 *       '400':
 *         description: Wrong username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post('/api/login', (req,res) => {
    console.log("login is running");
    //console.log(req.body);
    const username = req.body.name;
    const password = req.body.password;

    const sqlSelect = "SELECT * FROM users_t WHERE username = ? and password = ?;"
    db.query(sqlSelect, [username, password], (err,result) => {

        if (err) {
            res.send({err: err});
        }
        console.log(result);
        if(result.length > 0){
            req.session.user = {userId: result[0].UserId, username: username};
            //console.log(result);
            //console.log(req.session.user);
            res.send(result);
        }else{
            res.send({message: "Wrong username password combination"});
        }
        
    });
});

//LOGOUT
/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Logout user
 *     description: Logs out the currently authenticated user by destroying the session.
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: No session to log out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/api/logout', (req, res) => {
    // Check if a session exists
    if (req.session.user) {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ message: "Logout successful" });
            }
        });
    } else {
        res.send({ message: "No session to log out" });
    }
});




/*MONTHLY*/
//insert monthly set
/**
 * @swagger
 * /api/SetnewUSer:
 *   post:
 *     summary: Set new user monthly data
 *     description: Inserts new monthly data for a user, including income, bills, savings, budget, and day budget.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               income:
 *                 type: number
 *               bills:
 *                 type: number
 *               savings:
 *                 type: number
 *               budget:
 *                 type: number
 *               day:
 *                 type: number
 *     responses:
 *       200:
 *         description: Monthly data inserted successfully
 *       500:
 *         description: Internal server error
 */
app.post('/api/SetnewUSer', (req, res) => {
    console.log("SetnewUSer is running");
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
/**
 * @swagger
 * /api/getmonthlyset:
 *   post:
 *     summary: Get monthly set data for a user
 *     description: Retrieves monthly set data for a user based on the specified month and year.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Monthly set data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define properties based on your database schema
 *       404:
 *         description: No result found for the specified user, month, and year
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
app.post('/api/getmonthlyset', (req,res) => {
    console.log("getmonthlyset is running");
    console.log(req.body);
    const userId = req.body.user.userId;
    const month = req.body.month;
    const year = req.body.year;
    const sqlSelect = " SELECT * FROM monthlyset WHERE User = ? AND MONTH(UpdateDate) = ? AND YEAR(UpdateDate) = ?;";
    db.query(sqlSelect, [userId, month, year], (err,result) => {

        if (err) {
            res.send({err: err});
            console.log(err);
        }else if( (result.length > 0)){
            console.log(result);
            res.send(result);
        }else{
            res.send({message: 'No result'});
        }
            

           // res.send({message: "Wrong username password combination"});
    });
});

/**
 * @swagger
 * /api/AllSet:
 *   post:
 *     summary: Retrieve monthly set data for a user
 *     description: |
 *       This endpoint retrieves monthly set data for a specified user.
 *     requestBody:
 *       description: User ID in the request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user ID for which to retrieve monthly set data.
 *             example:
 *               user: "123456"
 *     responses:
 *       200:
 *         description: Successful response with monthly set data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define the properties of the monthly set data here
 *                   // For example:
 *                   id:
 *                     type: integer
 *                     description: Monthly set ID
 *                   name:
 *                     type: string
 *                     description: Name of the monthly set
 *                   // Add more properties as needed
 *               example:
 *                 - id: 1
 *                   name: "Monthly Set 1"
 *                 - id: 2
 *                   name: "Monthly Set 2"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing the issue
 *               example:
 *                 error: "Internal Server Error. Please try again later."
 */
app.post('/api/AllSet', (req,res) => {
    console.log("All set is running");
    console.log(req.body);
    const id = req.body.user;

    const sqlSelect = "SELECT * FROM monthlyset WHERE User = ?;";
    db.query(sqlSelect, [id], (err,result) => {
        if(err){
            console.log(err);
        }else if(result.length > 0){
            console.log(result);
            res.send(result);
        }
    });
});



//insert monthly expenses
/**
 * @swagger
 * /api/SetnewUserExpense:
 *   post:
 *     summary: Set new user expense
 *     description: Creates a new user expense record with initial values.
 *     tags:
 *       - Expense
 *     parameters:
 *       - in: body
 *         name: newUserExpense
 *         description: User ID for which the expense is to be set
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: The ID of the user for whom the expense is to be set.
 *               example: "user123"
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the result of the database query.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Inserted data details
 *       '400':
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Invalid or missing parameters"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */
app.post('/api/SetnewUserExpense', (req,res) => {
    console.log("SetnewUserExpense is running");
    console.log(req.body);
    const userId = req.body.userId;
    const sqlInsert = "INSERT INTO monthlyspent (UserID,Living,Entertainment,Other,Total) VALUES (?,0,0,0,0);"
    db.query(sqlInsert, [userId], (err,result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
        
    });
});

//check for monthlyspent
/**
 * @swagger
 * /api/getMonthlySpent:
 *   post:
 *     summary: Get monthly spent details for a user
 *     description: Retrieves monthly spending details for a user based on the specified month and year.
 *     tags:
 *       - Expense
 *     parameters:
 *       - in: body
 *         name: monthlySpentRequest
 *         description: Request object containing user ID, month, and year.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: The ID of the user for whom monthly spending details are to be retrieved.
 *               example: "user123"
 *             month:
 *               type: integer
 *               description: The month for which spending details are to be retrieved (1 to 12).
 *               example: 3
 *             year:
 *               type: integer
 *               description: The year for which spending details are to be retrieved.
 *               example: 2023
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the monthly spending details for the specified user, month, and year.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: []  # Array of monthly spending details
 *       '404':
 *         description: No data found. There are no spending details available for the specified user, month, and year.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "No result found"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */
app.post('/api/getMonthlySpent', (req,res) => {
    console.log("getMonthlySpent is running");
    console.log(req.body);
    const userId = req.body.user;
    const month = req.body.month;
    const year = req.body.year;
    
    const sqlSelect = "SELECT * FROM monthlyspent WHERE UserID = ? AND MONTH(Date) = ? AND YEAR(Date) = ?;";
    db.query(sqlSelect, [userId, month, year], (err, result) => {
        console.log(result);
        if(result.length > 0){
            res.send(result);
        }else{
            res.send({message: "No result"});
        }
    });

});

/**
 * @swagger
 * /api/SpentAll:
 *   post:
 *     summary: Retrieve monthly spent data for a user
 *     description: |
 *       This endpoint retrieves monthly spent data for a specified user.
 *     requestBody:
 *       description: User ID in the request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user ID for which to retrieve monthly spent data.
 *             example:
 *               user: "123456"
 *     responses:
 *       200:
 *         description: Successful response with monthly spent data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define the properties of the monthly spent data here
 *                   // For example:
 *                   id:
 *                     type: integer
 *                     description: Monthly spent ID
 *                   amount:
 *                     type: number
 *                     description: Amount spent for the month
 *                   category:
 *                     type: string
 *                     description: Category of the spent amount
 *                   // Add more properties as needed
 *               example:
 *                 - id: 1
 *                   amount: 100.00
 *                   category: "Groceries"
 *                 - id: 2
 *                   amount: 50.00
 *                   category: "Entertainment"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing the issue
 *               example:
 *                 error: "Internal Server Error. Please try again later."
 */
//get all moneyspent for progress
app.post('/api/SpentAll', (req,res) => {
    console.log("Spent all is running");
    console.log(req.body);
    const id = req.body.user;

    const sqlSelect = "SELECT * FROM monthlyspent WHERE UserID = ?;";
    db.query(sqlSelect, [id], (err,result) => {
        if(err){
            console.log(err);
        }else if(result.length > 0){
            console.log(result);
            res.send(result);
        }
    });
});


//update monthlyspent

/**
 * @swagger
 * /api/updateMonthlySpent:
 *   put:
 *     summary: Update monthly spending details
 *     description: Updates the monthly spending details for a user with the specified category and values.
 *     tags:
 *       - Expense
 *     parameters:
 *       - in: body
 *         name: updateMonthlySpentRequest
 *         description: Request object containing the ID of the monthly spent record to be updated, category, category value, and total value.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             updateRow:
 *               type: integer
 *               description: The ID of the monthly spent record to be updated.
 *               example: 123
 *             category:
 *               type: string
 *               description: The category to be updated (e.g., "Living", "Entertainment", "Other").
 *               example: "Living"
 *             categoryValue:
 *               type: number
 *               description: The value to be set for the specified category.
 *               example: 50.0
 *             totalvalue:
 *               type: number
 *               description: The total value to be set for the monthly spent record.
 *               example: 100.0
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the result of the database query.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Updated data details
 *       '400':
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Invalid or missing parameters"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */

app.put('/api/updateMonthlySpent', (req,res) => {
    console.log("patch is running");
    console.log(req.body);

    const ID = req.body.updateRow;
    const category = req.body.category;
    const categoryvalue = req.body.categoryValue;
    const totalvalue = req.body.totalvalue;

    const sqlUpdate = "UPDATE monthlyspent SET ?? = ?, Total = ? WHERE ID = ?;";
    db.query(sqlUpdate, [category,categoryvalue,totalvalue,ID], (err,result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result);
        }
    });
});



//DAILY
/**
 * @swagger
 * /api/SetnewUserDay:
 *   post:
 *     summary: Set new user day statistics
 *     description: Creates a new record for daily statistics for a user with initial values.
 *     tags:
 *       - DailyStats
 *     parameters:
 *       - in: body
 *         name: newUserDay
 *         description: User ID, available budget, and daily budget for which the daily statistics are to be set.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: The ID of the user for whom daily statistics are to be set.
 *               example: "user123"
 *             avail:
 *               type: number
 *               description: The available budget for the day.
 *               example: 50.0
 *             budget:
 *               type: number
 *               description: The daily budget for the day.
 *               example: 100.0
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the result of the database query.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Inserted data details
 *       '400':
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Invalid or missing parameters"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */
app.post('/api/SetnewUserDay', (req,res) => {
    console.log("SetnewUserDay is running");
    console.log(req.body);
    const userId = req.body.userId;
    const avail = req.body.avail;
    const budget = req.body.budget;

    const sqlInsert = "INSERT INTO dailystats (User, Spent, Avail, NewDayBudg, Date) VALUES (?,0,?,?,NOW());"
    db.query(sqlInsert, [userId, avail, budget], (err,result) => {
        
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});


//check if theres a daily set
/**
 * @swagger
 * /api/getdailyset:
 *   post:
 *     summary: Get daily set details for a user
 *     description: Retrieves daily set details for a user based on the specified day, month, and year.
 *     tags:
 *       - DailyStats
 *     parameters:
 *       - in: body
 *         name: dailySetRequest
 *         description: Request object containing user ID, day, month, year, and daily budget.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: The ID of the user for whom daily set details are to be retrieved.
 *               example: "user123"
 *             day:
 *               type: integer
 *               description: The day for which daily set details are to be retrieved (1 to 31).
 *               example: 15
 *             month:
 *               type: integer
 *               description: The month for which daily set details are to be retrieved (1 to 12).
 *               example: 3
 *             year:
 *               type: integer
 *               description: The year for which daily set details are to be retrieved.
 *               example: 2023
 *             budget:
 *               type: number
 *               description: The daily budget for the day.
 *               example: 100.0
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the daily set details for the specified user, day, month, and year.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: []  # Array of daily set details
 *       '404':
 *         description: No data found. There are no daily set details available for the specified user, day, month, and year.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "No result found"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */

app.post('/api/getdailyset', (req,res) =>{
    console.log("getdailyset is running");
    console.log(req.body);
    const userId = req.body.user;
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    const budget = req.body.budget;

    const sqlSelect = "SELECT * FROM dailystats WHERE User = ? AND DAY(Date) = ? AND MONTH(Date) = ? AND YEAR(Date) = ?;";
    db.query(sqlSelect, [userId,day,month,year], (err, result) => {
        
        if(err){
            console.log(err);
        }else if(result.length > 0){
            res.send(result);
            
            console.log("select: " + result.length);
            console.log(result);
        }else{
            console.log('no result');
            res.send({message: "Non-existant"});
        }
    });   
});

//insert newdailyset
/**
 * @swagger
 * /api/adddailyset:
 *   post:
 *     summary: Add daily set for a user
 *     description: Creates a new record for daily set details for a user with the specified daily budget.
 *     tags:
 *       - DailyStats
 *     parameters:
 *       - in: body
 *         name: dailySetRequest
 *         description: Request object containing user ID and daily budget to be added.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: The ID of the user for whom daily set details are to be added.
 *               example: "user123"
 *             budget:
 *               type: number
 *               description: The daily budget to be set for the day.
 *               example: 100.0
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the result of the database query.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Inserted data details
 *       '400':
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Invalid or missing parameters"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */
app.post('/api/adddailyset', (req,res) => {
    console.log("adddailyset is running");
    const userId = req.body.user;
    const daybudget = req.body.budget;

    const sqlInsert = "INSERT INTO dailystats (User, Spent, Avail, NewDayBudg, Date) VALUES (?, 0, ?, ? , NOW());";
    db.query(sqlInsert, [userId,daybudget,daybudget], (err,result) =>{
        if(err){
            console.log(err);
        }else{
            console.log("insert: ");
            console.log(result);
            res.send(result);
        }

        
    });
});

//update
/**
 * @swagger
 * /api/updatedailyset:
 *   put:
 *     summary: Update daily set for a user
 *     description: Updates the daily set details for a user with the specified spent amount, available budget, and new daily budget.
 *     tags:
 *       - DailyStats
 *     parameters:
 *       - in: body
 *         name: updateDailySetRequest
 *         description: Request object containing details for updating the daily set.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             updateHere:
 *               type: integer
 *               description: The ID of the daily set record to be updated.
 *               example: 123
 *             spent:
 *               type: number
 *               description: The amount spent for the day.
 *               example: 50.0
 *             avail:
 *               type: number
 *               description: The available budget for the day.
 *               example: 50.0
 *             newbudg:
 *               type: number
 *               description: The new daily budget for the day.
 *               example: 100.0
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the result of the database query.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Updated data details
 *       '400':
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Invalid or missing parameters"
 *       '404':
 *         description: Not found. The specified daily set record ID does not exist.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Record not found"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */
app.put('/api/updatedailyset', (req,res) => {
    console.log("updatedailyset is running");
    console.log(req.body);
    const row = req.body.updateHere;
    const spent = req.body.spent;
    const avail = req.body.avail;
    const budget = req.body.newbudg;

    const sqlUpdate = "UPDATE dailystats SET Spent = ?, Avail = ?,NewDayBudg = ? WHERE ID = ?;";
    db.query(sqlUpdate, [spent,avail,budget,row], (err,result) => {
        console.warn(result.message);
        res.send(result);
    });
});

//check for yesterday spent value
/**
 * @swagger
 * /api/getyesterday:
 *   post:
 *     summary: Get daily set details for the previous day
 *     description: Retrieves daily set details for a user based on the previous day's date.
 *     tags:
 *       - DailyStats
 *     parameters:
 *       - in: body
 *         name: yesterdaySetRequest
 *         description: Request object containing user ID, day, month, and year to retrieve details for the previous day.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: The ID of the user for whom daily set details for the previous day are to be retrieved.
 *               example: "user123"
 *             day:
 *               type: integer
 *               description: The day for which daily set details are to be retrieved (1 to 31).
 *               example: 15
 *             month:
 *               type: integer
 *               description: The month for which daily set details are to be retrieved (1 to 12).
 *               example: 3
 *             year:
 *               type: integer
 *               description: The year for which daily set details are to be retrieved.
 *               example: 2023
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the daily set details for the previous day.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: []  # Array of daily set details for the previous day
 *       '404':
 *         description: No data found. There are no daily set details available for the specified user and the previous day.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "No result found"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */
app.post('/api/getyesterday', (req,res) => {
    console.log("yesterday get is running");
    console.log(req.body);

    const id = req.body.user;
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    console.log(id,day,month,year);
    const sqlSelect = "SELECT * FROM dailystats WHERE User = ? AND DAY(Date) = ? AND MONTH(Date) = ? AND YEAR(Date) = ?;";
    db.query(sqlSelect, [id, day, month, year], (err,result) => {
        if(err){
            console.log(err);
        }else{
            if(result.length > 0){
                console.log(result);
                res.send(result);
            }
            
        }
    });
});


//TRANSACTIONS(ADD AND SUBTRACT)

/**
 * @swagger
 * /api/inserttransaction:
 *   post:
 *     summary: Insert a transaction
 *     description: Adds a new transaction record for a user with the specified details.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: body
 *         name: transactionRequest
 *         description: Request object containing user ID, transaction value, operation, category, and date.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: The ID of the user for whom the transaction is to be inserted.
 *               example: "user123"
 *             value:
 *               type: number
 *               description: The value of the transaction.
 *               example: 50.0
 *             operation:
 *               type: string
 *               description: The type of operation (e.g., "income" or "expense").
 *               example: "expense"
 *             category:
 *               type: string
 *               description: The category of the transaction.
 *               example: "food"
 *             date:
 *               type: string
 *               format: date
 *               description: The date of the transaction (YYYY-MM-DD).
 *               example: "2023-03-21"
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the result of the database query.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Inserted data details
 *       '400':
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Invalid or missing parameters"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */

app.post('/api/inserttransaction', (req,res) =>{
    console.log("inserttransation is running");
    console.log(req.body);
    const user = req.body.user;
    const value = req.body.value;
    const operation = req.body.operation;
    const category = req.body.category;
    const date = req.body.date;
    

    const sqlInsert ="INSERT INTO transactions (User, Value, Operation, Category, Date) VALUES (?,?,?,?,?);";
    db.query(sqlInsert, [user,value,operation,category,date], (err,result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.send(result);
        }
    });

});

//select

/**
 * @swagger
 * /api/gettransactions:
 *   post:
 *     summary: Get transactions for a user
 *     description: Retrieves transaction details for a user based on the specified month and year.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: body
 *         name: transactionsRequest
 *         description: Request object containing user ID, month, and year to retrieve transaction details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: The ID of the user for whom transactions are to be retrieved.
 *               example: "user123"
 *             month:
 *               type: integer
 *               description: The month for which transactions are to be retrieved (1 to 12).
 *               example: 3
 *             year:
 *               type: integer
 *               description: The year for which transactions are to be retrieved.
 *               example: 2023
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the transactions for the specified user, month, and year.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: []  # Array of transaction details
 *       '404':
 *         description: No data found. There are no transactions available for the specified user, month, and year.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "No result found"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */

app.post('/api/gettransactions', (req,res) => {
    console.log("gettransactions is running");
    console.log(req.body);
    const user = req.body.user;
    const month = req.body.month;
    const year = req.body.year;

    const sqlSelect = "SELECT * FROM transactions WHERE User = ? AND MONTH(Date) = ? AND YEAR(Date) = ?;";
    db.query(sqlSelect, [user,month,year], (err,result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.send(result);
        }
    });
});

//UNDO OPERATION

/**
 * @swagger
 * /api/getundo:
 *   get:
 *     summary: Get the last transaction for undo
 *     description: Retrieves the details of the last transaction made, which can be used for undoing the transaction.
 *     tags:
 *       - Transactions
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the details of the last transaction for undo.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Details of the last transaction for undo
 *       '404':
 *         description: No data found. There are no transactions available for undo.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "No result found"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */

app.get('/api/getundo', (req,res) => {
    const sqlSelect = "SELECT * FROM transactions ORDER BY ID DESC LIMIT 1;";
    db.query(sqlSelect, (err,result) => {
        if(err){
            console.log(err);
        }else{
            //console.log(result);
            res.send(result);
        }
    });
});

//delete
/**
 * @swagger
 * /api/deltransactions:
 *   post:
 *     summary: Delete a transaction
 *     description: Deletes a transaction record for a user with the specified ID.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: body
 *         name: deleteTransactionRequest
 *         description: Request object containing the ID of the transaction to be deleted.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             ID:
 *               type: integer
 *               description: The ID of the transaction to be deleted.
 *               example: 123
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the result of the database query.
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: {}  # Deleted data details
 *       '400':
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Invalid or missing parameters"
 *       '500':
 *         description: Internal server error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */

app.post('/api/deltransactions', (req,res) => {
    console.log("delete transaction is running");
    console.log(req.body);
    const ID = req.body.ID;

    const sqlDelete = "DELETE FROM transactions WHERE ID = ?;";
    db.query(sqlDelete, [ID], (err,result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result);
        }
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});