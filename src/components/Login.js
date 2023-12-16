import '../App.css';
import {Link} from 'react-router-dom';
import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import userSchema from '../validations/login';
import Axios from 'axios';

function LogIn() {

    const [loginStatus, setLoginStatus] = useState('');
    const history = useHistory();  // Initialize useHistory hook

    Axios.defaults.withCredentials = true;

    const handleSubmit = async(event) => {
      event.preventDefault();
      let formData = {
        name: event.target[0].value,
        password: event.target[1].value
      };

      //console.log(formData);

      const isValid = await userSchema.isValid(formData);
      //console.log(isValid);

      if(isValid){
        // Add form submission logic here
        Axios.post('http://localhost:3001/api/login', 
        {
          name: formData.name,
          password: formData.password
        }).then((response) => {
          if (response.data.message){
            setLoginStatus(response.data.message);
          }else{
            console.log(response);
            setLoginStatus(response.data[0].UserID);
            history.push('/home');
            
            console.log(response);
          }
          //console.log(response.data);
        });
      }else{
        alert('Invalid Input');
      }
      

      
    };

    useEffect(() => {
      Axios.get("http://localhost:3001/api/loginGET").then((response) => {
        console.log(response);
        if(response.data.loggedIn == true){
          setLoginStatus(response.data.user);
        }

      });
    }, []);


  return (
    <div id="LogIn-main">
      <form className="LS-Form" onSubmit={handleSubmit}>
        <h1 id="logo">BT</h1>
        <label>Username:</label><input type="text" name="username" required/>
        <label>Password:</label><input type="password" name="username" required/>
        
        <button type="submit">Log In</button>
      </form>
        <p>No account yet?</p><Link to="/signup">Sign Up</Link>
        <h1>{loginStatus}</h1>
    </div>
  );
}

export default LogIn;