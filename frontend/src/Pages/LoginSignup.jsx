import React, { useState } from 'react'
import './CSS/Loginsignup.css'
import email_icon from '../Components/Assets/email.png'
import password_icon from '../Components/Assets/password.png'
import person_icon from '../Components/Assets/person.png'
const LoginSignup = () => {

    const [state,setState] = useState("Login");
    const [formData,setFormData] = useState({
      username:"",
      password:"",
      email:""
    });

    const changeHandler = (e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }

    const login=async()=>{
      console.log("Login Executed",formData);
      let responseData;
      await fetch('https://e-commerce-backend-xyu4.onrender.com/login',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData)
      }).then((response)=>response.json()).then((data)=>responseData=data)

      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      }
      else{
        alert(responseData.errors);
      }
    }

    const signup=async()=>{
      console.log("Signup Executed",formData);
      let responseData;
      await fetch('https://e-commerce-backend-xyu4.onrender.com/signup',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData)
      }).then((response)=>response.json()).then((data)=>responseData=data)

      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      }
      else{
        alert(responseData.errors);
      }
    }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?
          <div className='inputt'>
          <img src={person_icon} alt="" />
          <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder='Name' /></div>:<></>}
          <div className='inputt'>
          <img src={email_icon} alt="" />
          <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder='Email' />
          </div>
          <div className='inputt'>
          <img src={password_icon} alt="" />
          <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
          </div>
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Login"?<p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>:<p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
