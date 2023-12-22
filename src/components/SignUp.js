import '../App.css';
import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import NewuserSchema from '../validations/signup';
import Axios from 'axios';
import { ToastContainer } from 'react-toastify';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom';

function SignIn() {
    const history = useHistory();  // Initialize useHistory hook
    const [duplicate, setDuplicate] = useState('');

    Axios.defaults.withCredentials = true;

    const handleSubmit = async(event) => {
      event.preventDefault();
      let formData = {
        name: event.target[0].value,
        password: event.target[1].value,
        email: event.target[2].value
      };

      //console.log(formData);

      const isValid = await NewuserSchema.isValid(formData);
      //console.log(isValid);
      //console.log(formData.name);

      if(isValid){
        // Add form submission logic here
        Axios.post('http://localhost:3001/api/insertuser',{
            name: formData.name, 
            password: formData.password, 
            email: formData.email
          }).then((response) => {
          if(response.data.message){
            setDuplicate(response.data.message);
            toast.error('Username already exists.', {position: 'top-center'});
          }else{
            //console.log(response.data.insertId);
            history.push('/calculate');
            //console.log("insert");
          }
        });
      }else{
        toast.info('For security, your Password must be 8 characters containing lowercase and uppercase letters, as well as numbers',
        {position: 'top-center', autoClose: 8000});
      }
         
    };

    useEffect(() => {
      Axios.get("http://localhost:3001/api/signupGET").then((response) => {
        console.log(response);
        if(response.data.loggedIn == true){
          console.log(response.data.insertId);
        }

      });
    }, []);

  return (
    <div id="SignIn-main">
      <ToastContainer />
      <form className="SI-Form" onSubmit={handleSubmit}>
        <h1 id="logo">GB</h1>
        <label>Username:</label><input 
            type="text" 
            name="username" 
            required
            />
        <label>Password:</label><input 
            type="password" 
            name="password" 
            required
            /> 
        <label>Email:</label><input 
            type="email" 
            name="email" 
            required 
            />
        <button type="submit">Sign Up</button>
      </form>
      <Link to="/">Back</Link>
      {/* <h3>{duplicate}</h3> */}
    </div>
  );
}

export default SignIn;