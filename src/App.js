import './App.css';
import Set from './layouts/Calcs';
import Dash from './layouts/Home';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Log from './layouts/Login';
import BudgetComponent from './components/datapractice';
import Sign from './layouts/Signin';
import Monthly from './layouts/MonthlySet';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
        <Route exact path="/">
            <Log/>
          </Route>
          <Route path="/signup">
            <Sign/>
          </Route>
          <Route path="/home">
            <Dash/>
          </Route>
          <Route path="/calculate">
            <Set/>
          </Route>
          <Route path="/date">
            <BudgetComponent/>
          </Route>
          <Route path="/monthly">
            <Monthly/>
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;

