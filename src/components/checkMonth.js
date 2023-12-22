import '../App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import { useHistory, useLocation  } from 'react-router-dom';

function CheckMonthlySet(){
    const history = useHistory();

    const [user, setUser] = useState('');
    Axios.defaults.withCredentials = true;
    useEffect(() => {
      console.log("First effect executed");
      Axios.get("http://localhost:3001/api/authorized").then((response) => {
        //console.log(response);
       if(response.data.message){
        alert('You are not authenticated');
       }else{
        setUser(response.data.userInfo);
        console.log("checkMonthlySet", response.data.userInfo);
       }
      });
    }, []);

    const [monthlyset, setmonthlySet] = useState([]);
    const [mspent, setmspent] = useState([]);
    useEffect(() => {
        console.log("monthly set ALL is running");
        console.log(user);

        Axios.post("http://localhost:3001/api/AllSet", {
            user: user.userId
        }).then((response) => {
            console.log(response);
            setmonthlySet(response.data);

            Axios.post('http://localhost:3001/api/SpentAll', {
                user: user.userId
            }).then((response) => {
                console.log(response);
                setmspent(response.data);
            });
        });

    }, [user]);

    function formatDate(dateString) {
        const jsDate = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return jsDate.toLocaleDateString('en-US', options);
    }

    function getMonthAndYear(sqlDateFormat) {
        // Convert SQL date format to JavaScript Date object
        const dateObject = new Date(sqlDateFormat);
    
        // Get month and year using toLocaleString with options
        const options = { month: 'long', year: 'numeric' };
        const formattedResult = dateObject.toLocaleString('en-US', options);
    
        return formattedResult;
    }

    const goBack = () => {
        history.push('/home');
        window.location.reload();
    }

    return (
        <div id='progressMain'>
            <div className='together'>
                <div className='monthContainer'>
                    <table className='monthTable'>
                        <thead>
                            <h1>Date</h1>
                        </thead>
                        <tbody>
                            {monthlyset.map((set) => (
                                <tr key={set.ID}>
                                    <td>
                                        <div>
                                            <p>{getMonthAndYear(formatDate(set.UpdateDate))}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='setContainer'>
                    <table className='setTable'>
                        <thead>
                            <h1>Goal</h1>
                        </thead>
                        <tbody>
                            {monthlyset.map((set) => (
                                <tr key={set.ID}>
                                    <td>
                                        <div>
                                            <p className='Left'>Monthly Budget:</p>
                                            <p className='Right'>{set.Budget}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='spentContainer'>
                    <table className='spentTable'>
                        <thead>
                            <h1>Actual</h1>
                        </thead>
                        <tbody>
                            {mspent.map((spent) => (
                                <tr key={spent.ID}>
                                    <td>
                                        <div>
                                            <p className='Left'>Actual Spent:</p>
                                            <p className='Right'>{spent.Total}</p>
                                        </div>
                                    </td>                                
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='buttonDiv'>
                    <button onClick={goBack}>Back</button>
            </div>
        </div>
    );

} 

export default CheckMonthlySet;