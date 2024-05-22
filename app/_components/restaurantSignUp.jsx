import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function RestaurantSignUp() {
  const initialState = {
    name: "",
    email: "",
    password: "",
    c_password: "",
    address: "",
    city: "",
    phone: ""
  };

  const [user, setUser] = useState(initialState);
  
  const[passworderror,setPasswordError]=useState(false);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const reset = () => {
    setUser(initialState);
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();
   
 
  
    const { name, email, password, phone, address, city } = user; // Corrected the destructuring
   
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
    if (!phone) {
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
      const response = await axios.post("http://localhost:3000/api/restaurants/signup", user);
      console.log(response);
      const data = response.data; // Parse the response data
      if (response.status === 200) {
        setUser(initialState);
        toast.success("Signup successful!");
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
    <div className='mb-5'>
        <ToastContainer />
      <h3 className='text-fuchsia-500 shadow-red-600 text-xl text-center'>signup page</h3>
      <div className='flex justify-center'>
        <img src="/Login.png" width={420} alt="img" height="auto" />
      </div>
      <div className="mx-4 md:mx-auto md:w-[400px]">
        <div>
          <input type="text" name="name" placeholder='Enter username' value={user.name} onChange={handlechange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
        </div>
        <div>
          <input type="text" name="email" placeholder='Enter email id' value={user.email} onChange={handlechange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
        </div>
        <div>
          <input type="password" name="password" placeholder='Enter password' onChange={handlechange} value={user.password} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' />
        
        {
          passworderror && <span className='text-red-600 text-xl'>Password & confirm password not match</span>
        }
        </div>

        <div>
          <input type="password" name="c_password" placeholder='Confirm password' onChange={handlechange}  value={user.c_password} className='w-full mt-2 md:w-[400px] p-2 rounded-md border-orange-500 border' />
        
          {
          passworderror && <span className='text-red-600 text-xl'>Password & confirm password not match</span>
        }
        </div>

        <div>
          <input type="text" name="city" placeholder='Enter city' onChange={handlechange} value={user.city} className='w-full mt-2 md:w-[400px] p-2 rounded-md border-orange-500 border' />
        </div>
        <div>
          <textarea name="address" placeholder='Enter address' onChange={handlechange} value={user.address} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' rows={7} cols={9}/>
        </div>
        <div>
          <input type="text" name="phone" placeholder='Enter phone number' onChange={handlechange} value={user.phone} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' />
        </div>
        <button type="button" onClick={reset} className='w-full text-white md:w-[400px] bg-fuchsia-600 p-3 rounded-lg mt-2'>Reset</button>
       {/*<button onClick={handleSignup} type="button" className='w-full md:w-[400px] bg-purple-600 p-3 rounded-lg mt-2 text-white'>Signup</button>*/}
       <button onClick={(e) => handleSignup(e)} type="button" className='w-full md:w-[400px] bg-purple-600 p-3 rounded-lg mt-2 text-white'>Signup</button>

      </div>
    </div>
  );
}

export default RestaurantSignUp;
