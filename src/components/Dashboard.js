import '../App.css';
import React, { useState, useEffect } from 'react';

function Dashboard() {

    //temporary, make sure to get the current month and year and days
    const month = 'January 2023'
    const today = 1
    const yesterday = 31
    const tomorrow = 2
    //teporary, make sure to set this in settings
    const Currency = 'PHP '

    //Budget Values taken from the Database (these values are temporary)
    //calculate consequent budget for the next days, monthly budget - today's expense / number of days left in the month 
    const [budgetData, setBudgetData] = useState({
      total: 19500,
      save: 2000,
      monthBudget: 15500,
      dayBudget: 500,
    });

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

    //for today's spent and available values
    const [spent, setSpent] = useState(0);
    const [available, setavailable] = useState(budgetData.dayBudget - spent);

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

    useEffect(() => {      
      setavailable(budgetData.dayBudget - spent); 
      setNewBudgetData(((budgetData.monthBudget - spent)/30).toFixed(1)); //TEMPORARY 31
    },[spent]);

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
          <h3 className='Month'>{month}</h3>
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
          <h3 className='Month'>{month}</h3>

            {categories.map((category) => (
                <div key={category}>
                    <p className={`${category} Left`}>{formatNumber(category)}:</p>
                    <p className={`${category}-Expense Right`}>
                        {Currency} {expenseData[category]}
                    </p>
                </div>
            ))}

          {/* <div>
            <p className='Living Left'>Living:</p>
            <p className='Living-Expense Right'>{Currency} 500</p>
          </div>
          <div>
            <p className='Bills Left'>Bills:</p>
            <p className='Bills-Expense Right'>{Currency} 0</p>
          </div>
          <div>
            <p className='Other Left'>Others:</p>
            <p className='Other-Expense Right'>{Currency} 250</p>
          </div>*/}
          
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
              {/* 
              <option value='living'>Living Costs</option>
              <option value='bills'>Bills</option>
              <option value='other'>Others</option> */}
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
          <div>
            <h3 className='Month'>{month}</h3>
            <a><h3>Notes and Calculations</h3></a>
          </div>
        </div>

      </div>
        
      
    </div>
  );
}

export default Dashboard;
