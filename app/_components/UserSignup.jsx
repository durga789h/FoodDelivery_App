"use client"
import React, { useState } from 'react'
import { ToastContainer,toast } from 'react-toastify';
//import CustomerHeader from './CustomerHeader'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function UserSignup() {

  const initialState = {
    name: "",
    email: "",
    password: "",
    c_password: "",
    address: "",
    city: "",
   mobile:"",
  };

  const [user, setUser] = useState(initialState);
  
 // const[passworderror,setPasswordError]=useState(false);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };
  const[passworderror,setPasswordError]=useState(false);

  const reset = () => {
    setUser(initialState);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
   
 
  
    const { name, email, password, mobile, address, city } = user; // Corrected the destructuring
   
    if (password !== user.c_password) {
      setPasswordError(true);
      return; // Exit function if passwords don't match
    }
    else {
      setPasswordError(false); // Reset password error state
    }

    if (name === "password" && value === "") {
      setPasswordError(false);
    }
  
    if (!name) {
      toast.error("name is required");
      return;
    }
    if (!email) {
      toast.error("email is required");
      return;
    }
    if (!password) {
      toast.error("password is required");
      return;
    }
    if (!mobile) {
      toast.error("phone is required");
      return;
    }
    if (!address) {
      toast.error("address is required");
      return;
    }
    if (!city) {
      toast.error("city is required");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/userdata/signup", user);
      console.log(response);
       // Parse the response data
      if (response.status === 200) {
        setUser(initialState);        
            
        toast.success("Signup successful!");
        sessionStorage.setItem("user", JSON.stringify(response.data.savedUser));
      } 
      else if (response.status === 400) {
        toast.error("There was a problem with your request. Please try again.");
      }
      else {
        console.log("Signup failed with status:", response.status);
      }
    } catch (error) {
      console.log("Signup failed", error.message);
    }
    
  };
  
  return (
    <div className='mt-3'>
        <ToastContainer />
      <div>
     <input type="text" name='name'
      className='p-3 rounded-full mb-3 border-purple-600 border w-[400px]'value={user.name} onChange={handlechange}  placeholder='enter name'/>
     </div>
     <div>
     <input type="email" name='email' className='p-3 rounded-full mb-3 border  w-[400px] border-purple-600' onChange={handlechange} value={user.email} placeholder='email'/>
     </div>
     <div>
     <input type="password" name='password' className='p-3 rounded-full mb-3  w-[400px] border border-purple-600' onChange={handlechange} value={user.password} placeholder='password'/>
     {
          passworderror && <span className='text-red-600 text-xl'>Password & confirm password not match</span>
        }
     </div>
     <div>
     <input type="password" name='c_password' className='p-3 rounded-full  w-[400px] mb-3 border border-purple-600' onChange={handlechange} value={user.c_password} placeholder='confirm password'/>
     {
          passworderror && <span className='text-red-600 text-xl'>Password & confirm password not match</span>
        }
     
     </div>
     <div>
     <input type="text" name='city' className='p-3 rounded-full mb-3 border  w-[400px] border-purple-600' onChange={handlechange} value={user.city} placeholder='city'/>
     </div>
     <div>
     <input type="text" name='address' className='p-3 rounded-full mb-3 border  w-[400px] border-purple-600' onChange={handlechange} value={user.address} placeholder='address'/>
     </div>
    <div>
    <input type="text" name='mobile' className='p-3 rounded-full mb-3 border  w-[400px] border-purple-600' onChange={handlechange} value={user.mobile} placeholder='mobile'/>
    </div>
     
     <button type='button' onClick={handleSignup} className='bg-blue-700 p-3 rounded-full w-[150px] mt-3 text-white'>Signup</button>
     <button type='button' className='bg-blue-700 p-3 rounded-full w-[150px] mt-3 text-white' onClick={reset}>Reset</button>
    </div>
  )
}
