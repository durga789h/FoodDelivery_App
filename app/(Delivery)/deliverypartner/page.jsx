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
        otp: "",
        otpLogin: false,
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

    const stripCountryCode = (mobile) => {
        return mobile.startsWith('+91') ? mobile.substring(3) : mobile;
    };

    const addCountryCode = (mobile) => {
        return mobile.startsWith('+91') ? mobile : `+91${mobile}`;
    };

    const checkIfRegistered = async (mobile) => {
        const strippedMobile = stripCountryCode(mobile);
        try {
            const response = await axios.get(`http://localhost:3000/api/deliverypartners/signup?mobile=${strippedMobile}`);
            return response.data.registered;
        } catch (error) {
            console.error("Error checking registration status:", error);
            return false;
        }
    };

    const handleOTPLogin = async () => {
        const { loginphone } = user;

        if (!loginphone) {
            toast.error("Phone is required");
            return;
        }

        try {
            setLoading(true);
            const isRegistered = await checkIfRegistered(loginphone);
            if (!isRegistered) {
                toast.error("Mobile number is not registered");
                return;
            }

            const formattedPhone = addCountryCode(loginphone);
            const response = await axios.post("http://localhost:3000/api/phoneverify", {
                mobile: formattedPhone,
            });
            console.log(response);
            if (response.status === 200) {
                toast.success("OTP sent successfully");
                setUser(prevUser => ({
                    ...prevUser,
                    otpLogin: true
                }));
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error); // Log the error
            toast.error("Failed to send OTP: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        const { loginphone, otp } = user;

        if (!loginphone || !otp) {
            toast.error("Phone and OTP are required");
            return;
        }

        try {
            setLoading(true);
            const formattedPhone = addCountryCode(loginphone);
            const response = await axios.post("http://localhost:3000/api/verify-otp", {
                mobile: formattedPhone,
                otp: otp
            });
            console.log(response);
            if (response.status === 200) {
                toast.success("OTP verified successfully");
                setUser(initialState);
                Router.push("/Delivery-main");
            } else {
                toast.error("Invalid OTP or OTP has expired");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error); // Log the error
            toast.error("OTP verification failed: " + error.message);
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
            if (response.status === 200) {
                setSignUpUser(initialState2);
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
    };

    // Navigate to delivery dashboard when user is registered
    useEffect(() => {
        const delivery = JSON.parse(sessionStorage.getItem("delivery"));
        if (delivery) {
            Router.push("/deliverydashboard");
        }
    }, []);

    return (
        <div className="container mx-auto px-4">
            <DeliveryHeader />
            <ToastContainer />
            <h1 className="text-2xl font-bold text-center my-4">Delivery Partner</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-10">
                <div className="flex flex-col items-center mx-4">
                    <img src="/Login.png" width={420} alt="img" className="w-full max-w-sm" />
                    <div className="w-full max-w-sm">
                        <input
                            type="text"
                            placeholder='Enter mobile no'
                            name="loginphone"
                            value={user.loginphone}
                            onChange={handleChange}
                            className='w-full p-3 mt-2 mb-2 rounded-md border border-orange-500'
                        />
                        {user.otpLogin && (
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                name="otp"
                                value={user.otp}
                                onChange={handleChange}
                                className='w-full p-3 mt-2 mb-2 rounded-md border border-orange-500'
                            />
                        )}
                        {user.otpLogin && (
                            <button onClick={handleVerifyOTP} className='w-full text-white bg-purple-600 p-3 rounded-lg mt-2'>
                                Verify OTP
                            </button>
                        )}
                        {!user.otpLogin && (
                            <button onClick={handleOTPLogin} className='w-full mt-3 text-white bg-blue-600 p-3 rounded-full'>
                                Send OTP
                            </button>
                        )}
                        <button onClick={reset} className='w-full text-white bg-fuchsia-600 p-3 rounded-lg mt-2'>
                            Reset
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center mx-4">
                    <img src="/Login.png" width={420} alt="img" className="w-full max-w-sm" />
                    <div className="w-full max-w-sm">
                        <input
                            type="text"
                            name='name'
                            className='p-3 rounded-full mb-3 border border-purple-600 w-full'
                            value={signupuser.name}
                            onChange={handlechange}
                            placeholder='Enter name'
                        />
                        <input
                            type="text"
                            placeholder='Enter mobile no'
                            name="mobile"
                            value={signupuser.mobile}
                            onChange={handlechange}
                            className='w-full p-3 mt-2 mb-2 rounded-full border border-purple-500'
                        />
                        <input
                            type="password"
                            name='password'
                            className='p-3 rounded-full mb-3 w-full border border-purple-600'
                            onChange={handlechange}
                            value={signupuser.password}
                            placeholder='Password'
                        />
                        {passworderror && <span className='text-red-600 text-sm'>Password & confirm password do not match</span>}
                        <input
                            type="password"
                            name='c_password'
                            className='p-3 rounded-full w-full mb-3 border border-purple-600'
                            onChange={handlechange}
                            value={signupuser.c_password}
                            placeholder='Confirm password'
                        />
                        {passworderror && <span className='text-red-600 text-sm'>Password & confirm password do not match</span>}
                        <input
                            type="text"
                            name='city'
                            className='p-3 rounded-full mb-3 border w-full border-purple-600'
                            onChange={handlechange}
                            value={signupuser.city}
                            placeholder='City'
                        />
                        <input
                            type="text"
                            name='address'
                            className='p-3 rounded-full mb-3 border w-full border-purple-600'
                            onChange={handlechange}
                            value={signupuser.address}
                            placeholder='Address'
                        />
                        <div className="flex justify-between">
                            <button type='button' onClick={handleSignup} className='bg-blue-700 p-3 rounded-full w-[150px] mt-3 text-white'>
                                Signup
                            </button>
                            <button type='button' className='bg-blue-700 p-3 rounded-full w-[150px] mt-3 text-white' onClick={reset2}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
