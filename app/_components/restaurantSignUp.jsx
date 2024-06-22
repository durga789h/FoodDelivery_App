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
  const [passwordError, setPasswordError] = useState(false);

  const handleChange = (e) => {
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

    const { name, email, password, phone, address, city } = user;

    if (password !== user.c_password) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    if (!name || !email || !password || !phone || !address || !city) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/restaurants/signup", user);
      console.log(response);
      if (response.status === 200) {
        setUser(initialState);
        toast.success("Signup successful! Please verify your email.");
      } else {
        toast.error("There was a problem with your request. Please try again.");
      }
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/restaurants/resend-verification", { email: user.email });
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error("There was a problem with your request. Please try again.");
      }
    } catch (error) {
      console.log("Resend verification failed", error.message);
      toast.error("Resend verification failed. Please try again.");
    }
  };

  return (
    <div className='mb-5'>
      <ToastContainer />
      <h3 className='text-fuchsia-500 shadow-red-600 text-xl text-center'>Signup Page</h3>
      <div className='flex justify-center'>
        <img src="/Login.png" width={420} alt="img" height="auto" />
      </div>
      <div className="mx-4 md:mx-auto md:w-[400px]">
        <input type="text" name="name" placeholder='Enter username' value={user.name} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
        <input type="text" name="email" placeholder='Enter email id' value={user.email} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
        <input type="password" name="password" placeholder='Enter password' value={user.password} onChange={handleChange} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' />
        {passwordError && <span className='text-red-600 text-xl'>Password & confirm password not match</span>}
        <input type="password" name="c_password" placeholder='Confirm password' value={user.c_password} onChange={handleChange} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' />
        {passwordError && <span className='text-red-600 text-xl'>Password & confirm password not match</span>}
        <input type="text" name="city" placeholder='Enter city' value={user.city} onChange={handleChange} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' />
        <textarea name="address" placeholder='Enter address' value={user.address} onChange={handleChange} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' rows={7} />
        <input type="text" name="phone" placeholder='Enter phone number' value={user.phone} onChange={handleChange} className='w-full md:w-[400px] p-2 mt-2 rounded-md border-orange-500 border' />
        <button type="button" onClick={reset} className='w-full text-white md:w-[400px] bg-fuchsia-600 p-3 rounded-lg mt-2'>Reset</button>
        <button onClick={handleSignup} type="button" className='w-full md:w-[400px] bg-purple-600 p-3 rounded-lg mt-2 text-white'>Signup</button>
        <button onClick={handleResendVerification} type="button" className='w-full md:w-[400px] bg-blue-600 p-3 rounded-lg mt-2 text-white'>Resend Verification Email</button>
      </div>
    </div>
  );
}

export default RestaurantSignUp;
