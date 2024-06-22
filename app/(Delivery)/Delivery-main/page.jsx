"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import DeliveryHeader from '../DeliveryHeader';

export default function DeliveryPartner() {
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

    const onLogin = async () => {
        const { loginphone, loginpassword } = user;

        if (!loginphone) {
            toast.error("Phone is required");
            return;
        }
        if (!loginpassword) {
            toast.error("Password is required");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/api/deliverypartners/login", {
                mobile: loginphone,
                password: loginpassword 
            });

            if (response.status === 200) {
                toast.success("Login successful");
                setUser(initialState);
                sessionStorage.setItem("delivery", JSON.stringify(response.data));
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

  
   
    useEffect(() => {
        const delivery = JSON.parse(sessionStorage.getItem("delivery"));
        if (delivery) {
            Router.push("/deliverydashboard");
        }
    }, []);

    return (
        <div>
              <DeliveryHeader />
              
            <ToastContainer />
            <h1 className='flex justify-center text-2xl text-pink-800'>Delivery Partner</h1>
        <div className='flex justify-center'>
          
           
            <div className='mt-8'>
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
                 
                      
                  
                        <button onClick={onLogin} className='w-full text-white md:w-[400px] bg-purple-600 p-3 rounded-lg mt-2'>
                            Login
                        </button>
            
                  
                    <button onClick={reset} className='w-full text-white md:w-[400px] bg-fuchsia-600 p-3 rounded-lg mt-2'>
                        Reset
                    </button>
                </div>

            </div>
        </div>
        </div>
    );
}
