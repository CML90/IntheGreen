# Setting up the project

1. In the greenbudget folder I first do:

### npm run start

2. Then, I open XAMPP -> run Apache and mySQL.
3. When everything is running, I cd into server and then

### npm run devStart

to get the backend running.

After that, everything can tested out on the UI.
Potential issues:
* Session expires early.
In this scenarion please go back to the original / route for login and login again.
* User is logged in but the values are not showing
Please refresh the page. It should the update the UI. 
Some pages are refreshed autmotically to solve this issue. 

## Swagger doc is at
### http://localhost:3001/api-docs/

## About the Project
#### /
Login page: yup validation and toastr.

#### /signup
* yup validation and toastr.
Please input a username, passsword (8 characters with lowercase letters, uppercase letters, and numbers), and a valid email format.
* Starts a session, inserts user into users_t table

#### /calculate
* yup validation and toastr.
Please input your month's income, your fixed costs for the month, and your saving goal.
Month's budget = income - bills - save goal
Day budget = month's budget/total days in the month
* Sets up the row for the user (this month only) in monthlyspent. Tracks the values above and computes for day budget.

The table monthlyset is automatically inserted with initial values of zero for expenses.
The table dailystats is automatically inserted with 0 for spent and available and NewDayBudg equal to the day budget. 
however, avail and new day budget changes according to the user's spending habits.

#### /home
Retrieves the data from monthlyspent, monthlyset, and dailystats.
Users can see how much they spent yesterday and how much they will be able to spend tomorrow.
The today spent value starts at 0 and available starts at the daybudget value. As spent increases available and newbudget(tomorrow) decreases.
Users can also undo transactions.

If, there is not monthlyspent row for the month (its a new month) -> 
##### /monthly
    Set income,bills,savings. Automatically add into monthlyset and dailystats.
    * There was an error in the video with the calculations for tomorrw, this has now been fixed.

If, there is not dailystats for the day (is a new day) ->
    It automatically inserts and reloads the home page.
    * Issue of it being inserted twice is now fixed

Users can scroll down to see their transactions within the month -showing date and amount (positive values for addng to expense and negative values for subtracting)

#### /progress
Three tables:
1. gets date and month from monthlyset
2. gets goal from monthlyset
3. gets toal spent from monthlyspent

This page shows the user how they are performing through comparing their goal and the actual scenario.

#### logout
Destroys the session and goes back to the login page (/)


## Backend
### The file for the database used for testing is in the server folder.
### below were the commands used to create the database

CREATE TABLE users_t
	(UserId INT(11) AUTO_INCREMENT NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY(UserId));

CREATE TABLE dailystats (
    ID INT(11) AUTO_INCREMENT NOT NULL,
    User INT(11) NOT NULL,
    Spent DECIMAL(20,2) NOT NULL,
    Avail DECIMAL(20,2) NOT NULL,
    NewDayBudg DECIMAL(20,2) NOT NULL,
    Date DATE NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT User_FK FOREIGN KEY (User) REFERENCES users_t(UserId)
);

CREATE TABLE monthlyset (
	ID INT(11) AUTO_INCREMENT NOT NULL,
    User INT(11) NOT NULL,
    UpdateDate DATE DEFAULT CURRENT_DATE NOT NULL,
    Income DECIMAL(20,2) NOT NULL,
    Bills DECIMAL(20,2) NOT NULL,
    Budget DECIMAL(20,2) NOT NULL, 
    Save DECIMAL(20,2) NOT NULL,
    DayBudget DECIMAL(20,2) NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT User_FK2 FOREIGN KEY (User) REFERENCES users_t(UserId)
);

CREATE TABLE monthlyspent (
	ID INT(11) AUTO_INCREMENT NOT NULL,
    UserId INT(11) NOT NULL,
    Living DECIMAL(20,2) NOT NULL,
    Entertainment DECIMAL(20,2) NOT NULL,
    Other DECIMAL(20,2) NOT NULL,
    Total DECIMAL(20,2) NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT User_FK3 FOREIGN KEY (UserId) REFERENCES users_t(UserId)
);

CREATE TABLE transactions (
	ID INT(11) AUTO_INCREMENT NOT NULL,
    User INT(11) NOT NULL,
    Value DECIMAL(20,2) NOT NULL,
    Operation VARCHAR(10) NOT NULL CHECK (Operation IN ('Add', 'Subtract')),
    Category VARCHAR(13) NOT NULL CHECK (Category IN ('Living', 'Entertainment','Other')),
    Date DATE DEFAULT CURRENT_DATE NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT User_FK4 FOREIGN KEY (User) REFERENCES users_t(UserId)
);

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
