import '../App.css';
import {Link} from 'react-router-dom';
import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import userSchema from '../validations/login';
import Axios from 'axios';
import { ToastContainer } from 'react-toastify';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

      console.log(formData);

      const isValid = await userSchema.isValid(formData);
      console.log(isValid);

      if(isValid){
        // Add form submission logic here
        Axios.post('http://localhost:3001/api/login', 
        {
          name: formData.name,
          password: formData.password
        }).then((response) => {
          if (response.data.message){
            setLoginStatus(response.data.message);
            toast.error(response.data.message, { position: 'top-center' });
            //console.log(loginStatus);
          }else{
            console.log(response);
            toast.success('Successful Login', { position: 'top-center' });
            setLoginStatus(response.data[0].UserID);
            history.push('/home');
            
            console.log(response);
            console.log(loginStatus);
          }
          //console.log(response.data);
        });
      }else{
        toast.warn('The input is invalid.', { position: 'top-center' });
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
      <ToastContainer />
      <form className="LS-Form" onSubmit={handleSubmit}>
        <h1 id="logo">GB</h1>
        <label>Username:</label><input type="text" name="username" required/>
        <label>Password:</label><input type="password" name="username" required/>
        
        <button type="submit">Log In</button>
      </form>
        <p>No account yet?</p><Link to="/signup">Sign Up</Link>
    </div>
  );
}

export default LogIn;