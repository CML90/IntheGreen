import '../App.css';

const Inputs = () => {
    return (
      
        <div className="Input">
          <div className='labels'>
            <label>Month's Income:</label>
            <label>Month's Bills:</label>
            <label>Month's Budget:</label>
          </div>
  
          <div className='inps'>
            <div>
              <input type="number"></input>
              <button className='SetIncome'>Set</button>
            </div>
  
            <div>
              <input type="number"></input>
              <button className='SetCost'>Set</button>
            </div>
  
            <div>
              <input type="number"></input>
              <button className='SetBudget'>Set</button>
            </div>
          </div>
  
          
        </div>
  
      
    );
  }
  
  export default Inputs;