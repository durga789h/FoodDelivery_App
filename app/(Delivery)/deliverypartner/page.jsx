"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import DeliveryHeader from '../DeliveryHeader'

export default function () {

    const initialState = {
        loginphone: "",
        loginpassword: "",
    };

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(initialState);
    const Router = useRouter();

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

    const onLogin =async () => {
        const { loginphone, loginpassword } = user;

        if (!loginphone) {
            toast.error("Phone is required");
            return;
        }
        if (!loginpassword) {
            toast.error("Password is required");
            return;
        }

        // Add your login logic here
        try {
          setLoading(true);
          const response = await axios.post("http://localhost:3000/api/deliverypartners/login", {
            mobile: loginphone,
            password: loginpassword 
             
          });

          if (response.status === 200) {
              toast.success("Login successful");
              setUser(initialState);
              sessionStorage.setItem("delivery",JSON.stringify(response.data))
              Router.push("/deliverydashboard");
          } else {
              if (response.data.error === "User does not exist") {
                  toast.error("User does not exist");
              } else if (response.data.error === "Invalid password") {
                  toast.error("Invalid password");
              } else {
                  toast.error("Login failed");
              }
          }
      } catch (error) {
          toast.error("Login failed: " + error.message);
      } finally {
          setLoading(false);
      }
  };

    const initialState2 = {
        name: "",
        password: "",
        c_password: "",
        address: "",
        city: "",
        mobile: "",
    };

    const [signupuser, setSignUpUser] = useState(initialState2);
    const [passworderror, setPasswordError] = useState(false);

    const handlechange = (e) => {
        const { name, value } = e.target;
        setSignUpUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const reset2 = () => {
        setSignUpUser(initialState2);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        const { name, password, mobile, address, city } = signupuser;

        if (password !== signupuser.c_password) {
            setPasswordError(true);
            return;
        } else {
            setPasswordError(false);
        }

        if (!name) {
            toast.error("Name is required");
            return;
        }
       
        if (!password) {
            toast.error("Password is required");
            return;
        }
        if (!mobile) {
            toast.error("Phone is required");
            return;
        }
        if (!address) {
            toast.error("Address is required");
            return;
        }
        if (!city) {
            toast.error("City is required");
            return;
        }
        try {
          const response = await axios.post("http://localhost:3000/api/deliverypartners/signup", signupuser);
          console.log(response);

          if (response.status === 200) {
              setSignUpUser(initialState2);

              // Remove password and c_password from the response before storing it
             // const { password, c_password, ...userData } = response.data;
              sessionStorage.setItem("delivery", JSON.stringify(response.data.savedUser));
              toast.success("Signup successful!");
              Router.push("/deliverydashboard");
          } else if (response.status === 400) {
              toast.error("There was a problem with your request. Please try again.");
          } else {
              console.log("Signup failed with status:", response.status);
          }
      } catch (error) {
          console.log("Signup failed", error.message);
      }
        
        // Add your signup logic here
    };

    useEffect(()=>{
        const delivery=JSON.parse(sessionStorage.getItem("delivery"))
        if(delivery){
            Router.push("deliverydashboard")
        }
    },[])

    return (
        <div>
        <DeliveryHeader/>
            <ToastContainer />
            <h1>Delivery partner</h1>
            <div className='flex justify-start'>

                <div className="mx-10 md:w-[400px]">
                    <div className='flex justify-center'>
                        <img src="/Login.png" width={420} alt="img" height="auto" />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Enter mobile no'
                            name="loginphone"
                            value={user.loginphone}
                            onChange={handleChange}
                            className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border'
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder='Enter password'
                            name='loginpassword'
                            onChange={handleChange}
                            value={user.loginpassword}
                            className='w-full md:w-[400px] p-2 rounded-md border-orange-500 border'
                        />
                    </div>
                    <button type="button" onClick={reset} className='w-full text-white md:w-[400px] bg-fuchsia-600 p-3 rounded-lg mt-2'>Reset</button>
                    <button type="button" onClick={onLogin} className='w-full text-white md:w-[400px] bg-purple-600 p-3 rounded-lg mt-2'>Login</button>
                </div>

                <div className='mx-auto'>
                    <div className='flex justify-center'>
                        <img src="/Login.png" width={420} alt="img" height="auto" />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='name'
                            className='p-3 rounded-full mb-3 border-purple-600 border w-[400px]'
                            value={signupuser.name}
                            onChange={handlechange}
                            placeholder='Enter name'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Enter mobile no'
                            name="mobile"
                            value={signupuser.mobile}
                            onChange={handlechange}
                            className='w-full md:w-[400px] rounded-full p-3 mt-2 mb-2 border-purple-500 border'
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name='password'
                            className='p-3 rounded-full mb-3 w-[400px] border border-purple-600'
                            onChange={handlechange}
                            value={signupuser.password}
                            placeholder='Password'
                        />
                        {passworderror && <span className='text-red-600 text-xl'>Password & confirm password do not match</span>}
                    </div>
                    <div>
                        <input
                            type="password"
                            name='c_password'
                            className='p-3 rounded-full w-[400px] mb-3 border border-purple-600'
                            onChange={handlechange}
                            value={signupuser.c_password}
                            placeholder='Confirm password'
                        />
                        {passworderror && <span className='text-red-600 text-xl'>Password & confirm password do not match</span>}
                    </div>
                    <div>
                        <input
                            type="text"
                            name='city'
                            className='p-3 rounded-full mb-3 border w-[400px] border-purple-600'
                            onChange={handlechange}
                            value={signupuser.city}
                            placeholder='City'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='address'
                            className='p-3 rounded-full mb-3 border w-[400px] border-purple-600'
                            onChange={handlechange}
                            value={signupuser.address}
                            placeholder='Address'
                        />
                    </div>

                    <button type='button' onClick={handleSignup} className='bg-blue-700 p-3 rounded-full w-[150px] mt-3 text-white'>Signup</button>
                    <button type='button' className='bg-blue-700 mx-10 p-3 rounded-full w-[150px] mt-3 text-white' onClick={reset2}>Reset</button>

                </div>
            </div>
        </div>
    );
}
