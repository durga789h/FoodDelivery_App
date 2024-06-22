"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const[email,setEmail]=useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
 // const [email, setEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get('token');
  //  const emailParam = searchParams.get('email');
    if (tokenParam) {
      setToken(tokenParam);
    }

   /* if (emailParam) {
      setEmail(emailParam);
    }*/
  }, []);

  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("New password is required");
      return;
    }
    console.log(token)
    if (!token) {
      toast.error("Invalid request parameters");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/userdata/reset-password", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token,email, newPassword }),
      });
      console.log(response)

      const responseData = await response.json();
       console.log(responseData);
      if (response.ok) {
        toast.success("Password reset successful");
        setNewPassword("");
        router.push("/user-auth");
      } else {
        toast.error(responseData.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password", error.message);
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mb-5'>
      <ToastContainer />
      <h3 className='text-fuchsia-500 shadow-red-600 text-xl text-center mt-2'>Reset Password</h3>
      <div className="mx-4 md:mx-auto md:w-[400px]">
        <form onSubmit={handleSubmit}>
        <input
            type="email"
            placeholder='name@gmail.com'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className='w-full p-3 mt-2 mb-2 rounded-md border-orange-500 border'
            required
          />
          <input
            type="password"
            placeholder='Enter new password'
            value={newPassword}
            onChange={handleChange}
            className='w-full p-3 mt-2 mb-2 rounded-md border-orange-500 border'
            required
          />
         
          <button
            type="submit"
            className='w-full text-white bg-purple-600 p-3 rounded-lg mt-2'
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
