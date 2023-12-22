import { useState, useEffect } from 'react';
import '../App.css';
import Axios from 'axios';

function Trans() {
  console.log("Trans is rendering");
  //console.log("New Transactions received:", newtransactions);
    const currency = 'PHP';
    //check for cookie
    const [user, setUser] = useState('');
    Axios.defaults.withCredentials = true;
    useEffect(() => {
      console.log("transactions First effect executed");
      Axios.get("http://localhost:3001/api/authorized").then((response) => {
        //console.log(response);
       if(response.data.message){
        alert('You are not authenticated');
       }else{
        setUser(response.data.userInfo);
        console.log("transactions", response.data.userInfo);
       }
      });
    }, []);

    const [currentDate, setCurrentDate] = useState(new Date());
    //TIMEDATE
    useEffect(() => {
      console.log("transaction 2nd effect executed");
      // Update the current date every minute
      const intervalId = setInterval(() => {
        setCurrentDate(new Date());
      }, 60000); // 60000 milliseconds = 1 minute

      // Clear the interval on component unmount
      return () => clearInterval(intervalId);
    }, [user]);

    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      console.log("Transactions effect is running");
      //console.log("transaction user", user.userId);
      Axios.post("http://localhost:3001/api/gettransactions", {
        user: user.userId,
        month: currentMonth,
        year: currentYear
      }).then((response) => {
        console.log(response.data);
        setTransactions(response.data);
        console.log(transactions);
      });
    }, [user]);

    //FORMAT DATE
    // Function to format date
    function formatDate(dateString) {
      const jsDate = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return jsDate.toLocaleDateString('en-US', options);
    }



  return (
    <div id="Dashboard-Main">     
      <div id="Transaction-History">
        <h2>Monthly Transaction History</h2>
        <table>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.ID}>
                <td>
                    <div className='intable'>
                        <p className='Trans-Date Left'>{formatDate(transaction.Date)}</p>
                        <p className='Trans-Amount Right'>{currency} {transaction.Value}</p>
                    </div>
                </td>
            </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trans;
