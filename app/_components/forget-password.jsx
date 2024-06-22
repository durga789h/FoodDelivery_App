"use client";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/userdata/forget", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success("Reset link sent to email");
        setEmail("");
        Router.push("/user-auth");
      } else {
        toast.error(responseData.error);
      }
    } catch (error) {
      console.error("Error sending reset link", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mb-5'>
      <ToastContainer />
      <h3 className='text-fuchsia-500 shadow-red-600 text-xl text-center mt-2'>Forget Password</h3>
      <div className="mx-4 md:mx-auto md:w-[400px]">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder='Enter your email'
            value={email}
            onChange={handleChange}
            className='w-full p-3 mt-2 mb-2 rounded-md border-orange-500 border'
            required
          />
          <button
            type="submit"
            className='w-full text-white bg-purple-600 p-3 rounded-lg mt-2'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
