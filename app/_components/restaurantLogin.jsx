import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RestaurantLogin() {
  const initialState = {
    email: "",
    password: "",
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
    const { email, password } = user;

    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/restaurants/login", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        toast.success("Login successful");
        setUser(initialState);
        sessionStorage.setItem("username", JSON.stringify(responseData.data.username));
        sessionStorage.setItem("userid", JSON.stringify(responseData.data.id));
        sessionStorage.setItem("jwt", responseData.token);
        Router.push("/restaurant/dashboard");
      } else {
        if (response.status === 400 && responseData.error === "User does not exist") {
          toast.error("User does not exist");
        } else if (response.status === 400 && responseData.error === "Invalid password") {
          toast.error("Invalid password");
        } else {
          console.error("Login failed with status:", response.status);
        }
      }
    } catch (error) {
      console.error("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mb-5'>
      <ToastContainer/>
      <h3 className='text-fuchsia-500 shadow-red-600 text-xl text-center mt-2'>Login page</h3>
      <div className='flex justify-center'>
        <img src="/Login.png" width={420} alt="img" height="auto" />
      </div>
      <div className="mx-4 md:mx-auto md:w-[400px]">
        <div>
          <input type="text" placeholder='Enter email id' name="email" value={user.email} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
        </div>
        <div>
          <input type="password" placeholder='Enter password' name='password' onChange={handleChange} value={user.password} className='w-full md:w-[400px] p-2 rounded-md border-orange-500 border' />
        </div>
        <button type="button" onClick={reset} className='w-full text-white md:w-[400px] bg-fuchsia-600 p-3 rounded-lg mt-2'>Reset</button>
        <button type="button" onClick={onLogin} className='w-full text-white md:w-[400px] bg-purple-600 p-3 rounded-lg mt-2'>Login</button>
      </div>
    </div>
  )
}

export default RestaurantLogin;
