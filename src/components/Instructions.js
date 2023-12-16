import '../App.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Directions(){
    return(
        <div id='directions'>
            <div className='defns'>
                <div>
                    <h3>Month's Income: </h3><p> The total amount of money you have for the month.</p>
                </div>
                <div>
                    <h3>Month's Bills: </h3><p> The set amount of expenses you must pay every month. For example, rent.</p>
                </div>
                <div>
                    <h3>Saving Goal: </h3><p> The amount of money you wish to save for the month.</p>
                </div>
                <div>
                <h3>Month's Budget = Month's Income - Month's Savings - Month's Bills</h3>
                </div>
                
            </div>

            <div className='exp'>
                <p>The resulting Monthly Budget is divided by the amount of days in the month. How much you spend on a day affects 
                    your daily budgets for succeeding days. 
                </p>
                <p>You may add your own categories for tracking your daily expenses. Please make sure input your spendings for an accurate calculation
                    and saving pattern. 
                </p>
                
            </div>
        </div>
        
    );
}

export default Directions;