import '../App.css';
import {Link} from 'react-router-dom';

function LogIn() {
  return (
    <div id="LogIn-main">
      <form className="LS-Form">
        <h1 id="logo">BT</h1>
        <label>Username:</label><input/>
        <label>Password:</label><input />
        <button>Log In</button>
      </form>
        <p>No account yet?</p><Link to="/signup">Sign Up</Link>
    </div>
  );
}

export default LogIn;