import { useState } from 'react';
import '../App.css';

function Trans() {

    const date  = 'January 2, 2023'
    const [transactions, setTransactions] = useState([
        {Date: "January 2,2023", Value: -248}
    ]);


  return (
    <div id="Dashboard-Main">     
      <div id="Transaction-History">
        <h2>Monthly Transaction History</h2>
        <table>
            <tbody>
                <tr>
                    <td>
                        transactions.map
                        <div className='intable'>
                            <p className='Trans-Date Left'>{date}</p>
                            <p className='Trans-Amount Right'>-PHP 248</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trans;
