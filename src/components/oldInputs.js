import '../App.css';
import React, {useState, useEffect} from "react";
import Axios from 'axios';
import money from '../validations/inputs';
import { useHistory } from 'react-router-dom';

const UserInputs = () => {
    const history = useHistory();

    const [user, setUser] = useState('');
    Axios.defaults.withCredentials = true;
    useEffect(() => {
      Axios.get("http://localhost:3001/api/authorized").then((response) => {
        console.log(response);
       if(response.data.message){
        alert('You are not authenticated');
       }else{
        setUser(response.data.userInfo);
       }
      });
    }, []);

    const [currentDate, setCurrentDate] = useState(new Date());
    useEffect(() => {
      // Update the current date every minute
      const intervalId = setInterval(() => {
        setCurrentDate(new Date());
      }, 60000); // 60000 milliseconds = 1 minute
  
      // Clear the interval on component unmount
      return () => clearInterval(intervalId);
    }, []);

    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const handleSubmit = async(event) => {
      event.preventDefault();
      let formData ={
        income: event.target[0].valueAsNumber,
        bills: event.target[1].valueAsNumber,
        savings: event.target[2].valueAsNumber,
        sum: event.target[1].valueAsNumber + event.target[2].valueAsNumber
      }
      console.log(formData);
      const isValid = await money.isValid(formData);
      console.log(isValid);

      if(isValid){
        Axios.post('http://localhost:3001/api/SetnewUser', 
        {
          userId: user.userId,
          income: formData.income,
          bills: formData.bills,
          savings: formData.savings,
          budget: formData.income - formData.sum,
          day: (formData.income - formData.sum)/totalDaysInMonth
        }).then((response) => {
          // if(err){
          //   alert('Error in insertion');
          // }

          //INSERT FOR MONTHLYSPENT
          console.log("setnewuserexpense is running");
          Axios.post('http://localhost:3001/api/SetnewUserExpense', {
            userId: user.userId 
          }).then((Secondresponse) => {
              console.log(Secondresponse);
              history.push('/home');
              window.location.reload();
          });

          //INSERT FOR DAILYSET (INITIAL)
          Axios.post('http://localhost:3001/api/SetnewUserDay',{
            userId : user.userId,
            avail: (formData.income - formData.sum)/totalDaysInMonth,
            budget: formData.income - formData.sum
          }).then((Secondresponse) => {
              console.log(Secondresponse);
          });
        });

        
      }else{
        alert('Income must be greater than bills + savings');
      }

    }

    return (
      
        <form className="Input" onSubmit={handleSubmit}>
        
          <div className='labels'>
            <h1>Welcome, {user.username} !</h1>
          </div>
  
          <div className='inps'>
            <div>
              <label>Month's Income:</label><input type="number" name="income" required></input>
            </div>
  
            <div>
              <label>Month's Bills:</label><input type="number" name="bills" required></input>
            </div>
  
            <div>
              <label>Saving Goal:</label><input type="number" name="savings"></input>
            </div>
          </div>
          <button type='submit'>I'm all set up!</button>

        </form>
  
      
    );
  }
  
  export default UserInputs;