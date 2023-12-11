import './App.css';
import Dashboard from './components/Dashboard';
import Trans from './components/Transactions';
import Set from './layouts/Calcs';
import Dash from './layouts/Home';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LogSign from './layouts/Login';


function App() {
  return (
    <Router>
      <div className="App">
        {/* <Dashboard/>
        <Trans/>  */}
        {/* <Set/> */}
        {/* <Dash/> */}
        <Switch>
        <Route exact path="/">
            <LogSign/>
          </Route>
          <Route path="/signup">
            <LogSign/>
          </Route>
          <Route path="/home">
            <Dash/>
          </Route>
          <Route path="/calculate">
            <Set/>
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;

