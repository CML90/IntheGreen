import '../App.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Trans from './Transactions';
import transactionSchema from '../validations/login';
import { ToastContainer } from 'react-toastify';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  
  console.log("Component is rendering");
  const history = useHistory();
  const [currentDate, setCurrentDate] = useState(new Date());

  //check for cookie
    const [user, setUser] = useState('');
    Axios.defaults.withCredentials = true;
    useEffect(() => {
      console.log("First effect executed");
      Axios.get("http://localhost:3001/api/authorized").then((response) => {
       console.log(response);
       if(response.data.message){
        toast.error('You are not authenticated', {position: 'top-center'});
       }else{
        setUser(response.data.userInfo);
        console.log(response.data.userInfo);
       }
      });
    }, []);

    //LOGOUT
    const handleLogout = () => {
      Axios.get("http://localhost:3001/api/logout")
          .then(response => {
              console.log(response.data); // Log the response data (success or error message)
              // Optionally, you can redirect the user or perform other actions based on the response
          })
          .catch(error => {
              console.error("Logout failed:", error);
              // Handle the error (e.g., display an error message to the user)
          });

          history.push('/');
    };
  

    //TIMEDATE
  useEffect(() => {
    console.log("2nd effect executed");
    // Update the current date every minute
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // 60000 milliseconds = 1 minute

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [user]);
  
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
      console.log("3rd effect executed : check month");
      if(user){
          Axios.post("http://localhost:3001/api/getmonthlyset", {
            user: user,
            month: currentMonth,
            year: currentYear
          }).then((response) => {
          //console.log(response);
            if(response.data.message){
              console.log("None");
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

    //for today's spent and available values
    const [spent, setSpent] = useState(0);
    const [available, setAvailable] = useState(0);
    //calculate the "ideal" budget for each day. This will only change every new month as a benchmark to actual values in reality
    //this is the adjusted budget due to what has been spent (or not) beforehand
    const [changeDayBudg, setNewBudgetData] = useState();
    //day ID
    const [updateThisRow, setNewRowData] = useState();

    const addNew = (bbuser,bavail,bbudget) => {
      console.log("addNew is running");
      Axios.post("http://localhost:3001/api/adddailyset", {
        user: bbuser,
        avail: bavail,
        budget: bbudget
      }).then((response) => {
        console.log("inserted");
      });
      window.location.reload();
    }

    useEffect( () => {
      console.log("4th effect executed: check day");
      if(budgetData.monthBudget > 0){
        Axios.post("http://localhost:3001/api/getdailyset", {
            user: user.userId,
            day: today,
            month: currentMonth,
            year: currentYear,
            budget: budgetData.dayBudget
        }).then((response) => {
            console.log("daily");
            console.log(response);
            if(response.data.message){
                addNew(user.userId, (budgetData.monthBudget - spent)/(totalDaysInMonth-today).toFixed(1), (budgetData.monthBudget - spent)/(totalDaysInMonth-today).toFixed(1));
                  //insert newdailystats
                  // Axios.post("http://localhost:3001/api/adddailyset", {
                  //   user: user.userId,
                  //   avail: budgetData.dayBudget,
                  //   budget: (budgetData.monthBudget - spent)/(totalDaysInMonth-today).toFixed(1)
                  // }).then((response) => {
                  //     console.log("inserted");
                  // });
              
            }else{
              console.log(response.data);
              //assign returned values to component variables
              setNewRowData(response.data[0].ID);
              console.log(updateThisRow);
              setSpent(response.data[0].Spent);
              setAvailable(response.data[0].Avail);
              setNewBudgetData(response.data[0].NewDayBudg);
              //CHECK THIS THEN WORK ON UPDATE AND THEN TRANSACTIONS
            }
        });
      }
    }, [budgetData]);

  //UPDATE DAILYSTATS TABLE 
  //occurs when SetSpent is called in the Add, Subtract functions
  //change the newbudget data for tomorrow according to the number of days left in the month (excluding today)
  // useEffect(() => {  
  //   console.log("5th effect executed: change avail and budget");    
  //   //console.log(budgetData.dayBudget);
     
  //   console.log("available is" + available);
    
  // },[spent]);

  const update = (newSpent, newAvail, newBudget)=>{
    console.log("update is called");
    console.log(newSpent);
    console.log(newAvail);
    console.log(newBudget);
    setAvailable(newAvail);
    setNewBudgetData(newBudget);

    Axios.put("http://localhost:3001/api/updatedailyset", {
      updateHere: updateThisRow,
      spent: newSpent,
      avail: newAvail,
      newbudg: newBudget
    }).then((response) => {

    });
  };


  //YESTERDAY VALUES FROM DAILYSET
  const [yesterdayValue, setYesterdayValue] = useState();

  useEffect (() => {
    console.log("5th effect is running: yesterday");
      Axios.post('http://localhost:3001/api/getyesterday', {
        user: user.userId,
        day: yesterday,
        month: currentMonth,
        year: currentYear
      }).then((response) => {
        console.log(response);
        if(response.data[0].Spent){
          console.log(response.data[0].Spent);
          const newvalue = response.data[0].Spent;
          setYesterdayValue(newvalue);
        }
        
      });
  }, [user]);



    //EXPENSE Portion
    //categories are set in db now, would like to add categories dynamically later
    const [categories, setCategories] = useState([
        'Living','Entertainment','Other'
    ]);

    const [patchThis, setPatchThis] = useState();

    //Expense Values taken from the Database (these values are temporary -> start with clean slate in this case. As if first day of month)
    //when a category is added, its initial value is 0. Total is the sum of all category values
    const [expenseData, setexpenseData] = useState({
        Living: 0,
        Entertainment: 0,
        Other: 0,
        Total: 0
    });

    useEffect(() => {
      console.log("6th effect executed: monthlyexpense")
      if(user){
        Axios.post('http://localhost:3001/api/getMonthlySpent', {
          user: user.userId,
          month: currentMonth,
          year: currentYear
        }).then((response) => {
          console.log(response.data);
          if(response.data.message){
            //insert
            // Axios.post('http://localhost:3001/api/SetnewUserExpense', {
            //   user: user.userId
            // }).then((response) => {

            // });
            console.log('no monthly expense');
          }else{
            //assign variables
            setPatchThis(response.data[0].ID);
            console.log(patchThis);
            const updatedExpense = {
              Living: response.data[0].Living,
              Entertainment: response.data[0].Entertainment,
              Other: response.data[0].Other,
              Total: response.data[0].Total
            }

            setexpenseData(updatedExpense);
          }
        });
      }
    }, [budgetData]);

    const patch = (categoryValue,newCatValue,newTotValue) => {
      Axios.put("http://localhost:3001/api/updateMonthlySpent", {
        updateRow: patchThis,
        category: categoryValue,
        categoryValue: newCatValue,
        totalvalue: newTotValue
      });
    }


    //calculate the total Expenses
    // const calcTotExpense = () => {
    //     return Object.values(expenseData).reduce((total, amount) => total + amount, 0);
    // };

    //for category in transaction table, add into DB later on
    const [categoryValue, setCategoryValue] = useState('Living');

    const handleCategoryChange = (event) => {
        setCategoryValue(event.target.value);
    };

    //for value in transaction table, add into DB later on
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const formattedDate = currentDate.toISOString().split('T')[0];
    //for date in transaction table, add into DB later on
    const [selectedDate, setSelectedDate] = useState(formattedDate);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };


    //add to todays spending, add new transaction in db, calculate new available value and calculate succeeding day budgets
    const AddExpense = async() => {
        console.log("Category: ", categoryValue);
        console.log("Add Expense: ", inputValue);
        console.log("Date: ", selectedDate);

        const isValid = await transactionSchema.isValid(inputValue);
        console.log(isValid);

        const expenseAmount = parseFloat(inputValue);
        const newSpent = spent + expenseAmount;
        console.log((budgetData.monthBudget - expenseAmount)/(totalDaysInMonth-today));
        

        const newCatValue = expenseData[categoryValue] + expenseAmount;
        const newTotValue = expenseData.Total + expenseAmount;
        update(newSpent, available - expenseAmount, (budgetData.monthBudget - newTotValue)/(totalDaysInMonth-today));
        patch(categoryValue,newCatValue,newTotValue);

        setSpent(newSpent);
        setexpenseData((prevExpenseData) => ({
            ...prevExpenseData,
            [categoryValue]: prevExpenseData[categoryValue] + expenseAmount,
            Total: prevExpenseData.Total + expenseAmount,
        }));

        Axios.post("http://localhost:3001/api/inserttransaction", {
            user: user.userId,
            value: inputValue,
            operation: 'Add',
            category: categoryValue,
            date: selectedDate
        }).then((result) => {
          console.log("insert transactions result", result);
        });

    };

    //minus to todays spending, add new transaction in db, calculate new available value and calculate succeeding day budgets
    const SubExpense = async() => {
        // console.log("Category: ", categoryValue);
        // console.log("Subtract Expense: ", inputValue);
        // console.log("Date: ", selectedDate);

        
        const isValid = await transactionSchema.isValid(inputValue);
        console.log(isValid);

        const expenseAmount = parseFloat(inputValue);
        const newSpent = spent - expenseAmount;

        const newCatValue = expenseData[categoryValue] - expenseAmount;
        const newTotValue = expenseData.Total - expenseAmount;
        patch(categoryValue,newCatValue,newTotValue);
        update(newSpent, available + expenseAmount, (budgetData.monthBudget - newTotValue)/(totalDaysInMonth-today));

        setSpent(newSpent);
        setexpenseData((prevExpenseData) => ({
            ...prevExpenseData,
            [categoryValue]: prevExpenseData[categoryValue] - expenseAmount,
            Total: prevExpenseData.Total - expenseAmount,
        }));

        Axios.post("http://localhost:3001/api/inserttransaction", {
            user: user.userId,
            value: inputValue*(-1),
            operation: 'Subtract',
            category: categoryValue,
            date: selectedDate
        });

    };

    //delete the last transaction, recalculate available value and succeeding day budgets
    const UndoOperation = () => {
        console.log("Category: ", categoryValue);
        console.log("Undo: ", inputValue);
        console.log("Date: ", selectedDate);

        Axios.get("http://localhost:3001/api/getundo").then((result) => {
              console.log(result);
              if(result.data[0].Operation === "Add"){
                console.log("addition");
                //undo in UI and backend
                //dailystats
                const expenseAmount = result.data[0].Value;
                const newSpent = spent - expenseAmount;

                update(newSpent, available + expenseAmount, (budgetData.monthBudget + expenseAmount)/(totalDaysInMonth-today));
                setSpent(newSpent);


                //monthlyspent
                setexpenseData((prevExpenseData) => ({
                  ...prevExpenseData,
                  [categoryValue]: prevExpenseData[categoryValue] - expenseAmount,
                  Total: prevExpenseData.Total - expenseAmount,
                }));

                const categoryValue = result.data[0].Category;
                const newCatValue = expenseData[categoryValue] - expenseAmount;
                const newTotValue = expenseData.Total - expenseAmount;

                patch(categoryValue,newCatValue,newTotValue);

                //delete
                Axios.post("http://localhost:3001/api/deltransactions",{
                  ID: result.data[0].ID
                });

              }else if(result.data[0].Operation === "Subtract"){
                console.log("subtraction");
                //undo in UI and backend
                //dailystats
                const expenseAmount = result.data[0].Value*(-1);
                const newSpent = spent + expenseAmount;

                update(newSpent, available - expenseAmount, (budgetData.monthBudget - expenseAmount)/(totalDaysInMonth-today));
                setSpent(newSpent);

                //monthlyspent
                setexpenseData((prevExpenseData) => ({
                  ...prevExpenseData,
                  [categoryValue]: prevExpenseData[categoryValue] + expenseAmount,
                  Total: prevExpenseData.Total + expenseAmount,
                }));

                const categoryValue = result.data[0].Category;
                const newCatValue = expenseData[categoryValue] + expenseAmount;
                const newTotValue = expenseData.Total + expenseAmount;

                patch(categoryValue,newCatValue,newTotValue);

                //delete
                Axios.post("http://localhost:3001/api/deltransactions",{
                  ID: result.data[0].ID
                });
              }
        });

        //undo the last transaction
        //edit daily spent
        //edit monthlyspent

        //get last transaction, 
        //if operation is subtraction or addition

    };

    // Function to format numbers with commas or spaces for thousands separators
    const formatNumber = (number) => {
      return number.toLocaleString(); 
      // You can also pass a locale string as an argument for a specific formatting
    };
    //change color
    const divClassName = spent > budgetData.dayBudget ? 'redToday' : 'normalToday';

  return (
    <div id="Dashboard-Main">
      <ToastContainer/>
      <button className='logoutbutt' onClick={handleLogout}>Log Out</button>
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
            <h3 className='Left'>Total Spent:</h3><h3 className='Budget Right'>{Currency} {formatNumber(expenseData.Total)}</h3>
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
                {/* <option value='none'>None</option> */}
                {categories.map((category) => (
                    <option key={category} value = {category}>{category}</option>
                ))}
            </select>

            <input name="value" type='number' onChange={handleInputChange}></input>
            <input name="date" type='date' onChange={handleDateChange}></input>
            
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
            <p className='YSpent-amount Amount'>{Currency} {yesterdayValue}</p>
          </div>
          
        </div>

        <div id="Tomorrow">
          <div>
            <h3>Tomorrow</h3>
            <h3 className='Tomorrow-Day'>{tomorrow}</h3>
          </div>
          <div>
            <p>Spendable</p>
            <p className='TSpent-amount Amount'>{Currency} {changeDayBudg}</p>
          </div>
          
        </div>

        <div id="To-Notes">
          <Link to="/progress">
            <div>
              <h3 className='Month'>{monthYear}</h3>
              <h3>Progress</h3>
            </div>
          </Link>
          
        </div>

      </div>
        
      <Trans/>
    </div>
  );
}

export default Dashboard;
