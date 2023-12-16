import '../App.css';
import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import NewuserSchema from '../validations/signup';
import Axios from 'axios';


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
          }else{
            //console.log(response.data.insertId);
            history.push('/calculate');
            //console.log("insert");
          }
        });
      }else{
        alert('Invalid Input');
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
      <form className="SI-Form" onSubmit={handleSubmit}>
        <h1 id="logo">BT</h1>
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
      <h3>{duplicate}</h3>
    </div>
  );
}

export default SignIn;