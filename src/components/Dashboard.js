import '../App.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';


function Dashboard() {
  const history = useHistory();
  const [currentDate, setCurrentDate] = useState(new Date());

  //check for cookie
    const [user, setUser] = useState('');
    Axios.defaults.withCredentials = true;
    useEffect(() => {
      Axios.get("http://localhost:3001/api/authorized").then((response) => {
        //console.log(response);
       if(response.data.message){
        alert('You are not authenticated');
       }else{
        setUser(response.data.userInfo);
       }
      });
    }, []);


    //TIMEDATE
  useEffect(() => {
    // Update the current date every minute
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 60000 milliseconds = 1 minute

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
    //dates needed
    const monthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const today = currentDate.getDate();
    const yesterday = currentDate.getDate() - 1;
    const tomorrow = currentDate.getDate() + 1;

    //dayBudget calculation variables
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based
    const currentYear = currentDate.getFullYear();
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    //for now, just PHP
    const Currency = 'PHP '

    //MONTHLY
    //if it is the first in the month, go to a different page to input new month's details
    //only do this if there is no row in db for new month's set
    //Use budgetData for it

    //Budget Values taken from the Database
    //calculate consequent budget for the next days, monthly budget - today's expense / number of days left in the month 
    const [budgetData, setBudgetData] = useState({
      total: 0,
      save: 0,
      monthBudget: 0,
      dayBudget: 0, //initialization only
    });

    //get values from the database and initialize budgetData
    //if now row, insert monthly
    useEffect(()=>{
      if(user){
          Axios.post("http://localhost:3001/api/getmonthlyset", {
            user: user,
            month: currentMonth,
            year: currentYear
          }).then((response) => {
          //console.log(response);
            if(response.data.message){
              //console.log("None");
              history.push('/monthly');
            }else{
              const updatedBudgetData = {
                total: response.data[0].Income,
                save: response.data[0].Save,
                monthBudget: response.data[0].Budget,
                dayBudget: response.data[0].DayBudget,
              };
              setBudgetData(updatedBudgetData); 
            }
        });
      }
    }, [user]);

    //DAILY
    //If non-existant, Insert row to track spent, avail, and newdaybudget
    //If exists, extract data to show in component
    //update when needed

    useEffect(() => {
      if(user){
        Axios.post("http://localhost:3001/api/getdailyset", {
            user: user,
            date: today
        }).then((response) => {

        });
      }
    }, [user]);

    //for today's spent and available values
    const [spent, setSpent] = useState(0);
    const [available, setAvailable] = useState(budgetData.dayBudget - spent);
    //change avail when monthly set details are selected
    useEffect(() => {
      setAvailable(budgetData.dayBudget - spent);
    }, [budgetData]);
   
   //change the newbudget data for tomorrow according to the number of days left in the month (excluding today)
   useEffect(() => {      
    setAvailable(budgetData.dayBudget - spent); 
    setNewBudgetData(((budgetData.monthBudget - spent)/(totalDaysInMonth-today)).toFixed(1)); //TEMPORARY 31
  },[spent]);

    //calculate the "ideal" budget for each day. This will only change every new month as a benchmark to actual values in reality
    //this is the adjusted budget due to what has been spent (or not) beforehand
    const [changeDayBudg, setNewBudgetData] = useState();

    //Expense Portion
    //categories are added dynamically
    const [categories, setCategories] = useState([
        'Living','Bills','Others'
    ]);

    //Expense Values taken from the Database (these values are temporary -> start with clean slate in this case. As if first day of month)
    //when a category is added, its initial value is 0. Total is the sum of all category values
    const [expenseData, setexpenseData] = useState({
        Living: 0,
        Bills: 0,
        Others: 0,
        Total: 0,
    });

    //calculate the total Expenses
    const calcTotExpense = () => {
        return Object.values(expenseData).reduce((total, amount) => total + amount, 0);
    };
    
    // Function to format numbers with commas or spaces for thousands separators
    const formatNumber = (number) => {
        return number.toLocaleString(); 
        // You can also pass a locale string as an argument for a specific formatting
    };

 
    //change color
    const divClassName = spent > budgetData.dayBudget ? 'redToday' : 'normalToday';

    //for category in transaction table, add into DB later on
    const [categoryValue, setCategoryValue] = useState('');

    const handleCategoryChange = (event) => {
        setCategoryValue(event.target.value);
    };

    //for value in transaction table, add into DB later on
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    //for date in transaction table, add into DB later on
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    //add to todays spending, add new transaction in db, calculate new available value and calculate succeeding day budgets
    const AddExpense = () => {
        console.log("Category: ", categoryValue);
        console.log("Add Expense: ", inputValue);
        console.log("Date: ", selectedDate);

        const expenseAmount = parseFloat(inputValue);
        setSpent(spent + expenseAmount);

        setexpenseData((prevExpenseData) => ({
            ...prevExpenseData,
            [categoryValue]: prevExpenseData[categoryValue] + expenseAmount,
        }));
    };

    //minus to todays spending, add new transaction in db, calculate new available value and calculate succeeding day budgets
    const SubExpense = () => {
        console.log("Category: ", categoryValue);
        console.log("Subtract Expense: ", inputValue);
        console.log("Date: ", selectedDate);

        const expenseAmount = parseFloat(inputValue);
        setSpent(spent - expenseAmount);

        setexpenseData((prevExpenseData) => ({
            ...prevExpenseData,
            [categoryValue]: prevExpenseData[categoryValue] - expenseAmount,
        }));
    };

    //delete the last transaction, recalculate available value and succeeding day budgets
    const UndoOperation = () => {
        console.log("Category: ", categoryValue);
        console.log("Undo: ", inputValue);
        console.log("Date: ", selectedDate);
    };

  return (
    <div id="Dashboard-Main">
      <div className='Dash'>
      <div id="Budget">
          <h3 className='Month'>{monthYear}</h3>
          <div>
            <p className='Left'>Total:</p>
            <p className='Total-Amount Right'>{Currency}{formatNumber(budgetData.total)}</p>
          </div>
          <div>
            <p className='Left'>Save:</p>
            <p className='Save-Amount Right'>{Currency}{formatNumber(budgetData.save)}</p>
          </div>
          <div>
            <p className='Left'>Month Budget:</p>
            <p className='MB-Amount Right'>{Currency}{formatNumber(budgetData.monthBudget)}</p>
          </div>
          
          <div className="emphasize">
            <h3 className='Left'>Day Budget:</h3><h3 className='Budget Right'>{Currency}{formatNumber(budgetData.dayBudget)}</h3>
          </div>
        </div>

        <div id="Expense">
        {/* divs are dynamically created according to the categories added in Set page 
            size or position needs to be updated if number of categories start to get larger*/}
          <h3 className='Month'>{monthYear}</h3>

            {categories.map((category) => (
                <div key={category}>
                    <p className={`${category} Left`}>{formatNumber(category)}:</p>
                    <p className={`${category}-Expense Right`}>
                        {Currency} {expenseData[category]}
                    </p>
                </div>
            ))}
          
          <div className="emphasize">
            <h3 className='Left'>Total Spent:</h3><h3 className='Budget Right'>{Currency} {formatNumber(calcTotExpense())}</h3>
            {/* becomes NaN when Non category is picked for adding and subtracting */}
          </div> 
        </div>

          {/* change color when over day budget */}
        <div id="Today" className={divClassName}>
          <div className='amounts'>
            <div className='first-div'>
              <h3>Today</h3>
              <h3 className='Today-Day'>{today}</h3>
            </div>

            <div className='SA'>
              <div>
                <p>Spent</p>
                <p className='Spent-amount Amount'>{Currency} {formatNumber(spent)}</p> {/*248*/}
              </div>
              <div>
                <p>Available</p>
                <p className='Available-amount Amount'>{Currency} {formatNumber(available)}</p> {/*250*/}
              </div>
            </div>
            
          </div>
          
          <div className='inputting'>
            {/* categories are dynamically added according to categories above */}
            <select name='category' id='category' onChange={handleCategoryChange}>
                <option value='none'>None</option>
                {categories.map((category) => (
                    <option key={category} value = {category}>{category}</option>
                ))}
            </select>

            <input type='number' onChange={handleInputChange}></input>
            <input type='date' onChange={handleDateChange}></input>
            
            <div className='buttons-div'>
              <button className='Add' onClick={AddExpense}>Add</button>
              <button className='Subtract' onClick={SubExpense}>Subtract</button>
              <button className='Undo' onClick={UndoOperation}>Undo</button>
            </div>
          </div>
        </div>

        <div id="Yesterday">
          <div>
            <h3>Yesterday</h3>
            <h3 className='Yesterday-Day'>{yesterday}</h3>
          </div>
          
          <div>
            <p>Spent</p>
            <p className='YSpent-amount Amount'>{Currency} 502</p>
          </div>
          
        </div>

        <div id="Tomorrow">
          <div>
            <h3>Tomorrow</h3>
            <h3 className='Tomorrow-Day'>{tomorrow}</h3>
          </div>
          <div>
            <p>Spendable</p>
            <p className='TSpent-amount Amount'>{Currency} {changeDayBudg}</p> {/*508 */}
          </div>
          
        </div>

        <div id="To-Notes">
          <Link to="/calculate">
            <div>
              <h3 className='Month'>{monthYear}</h3>
              <a><h3>Notes and Calculations</h3></a>
            </div>
          </Link>
          
        </div>

      </div>
        
      
    </div>
  );
}

export default Dashboard;
