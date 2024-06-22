"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/Admin/login',
        {email, password });
      console.log(response)
     
      const { token } = response.data;
      sessionStorage.setItem('token', token);
      router.push('/Admin/panel');
    } catch (error) {
      setError(error.response.data.error);
    }
  };
  useEffect(() => {
    let token = sessionStorage.getItem("token");
    if (token) {
      router.push('/Admin/panel');
    }
}, [router]);

  

  return (
    <div>
        <h1 className='text-center text-2xl text-fuchsia-700'>Admin Login</h1>
    <div className='flex justify-center'>
      
      <form onSubmit={handleSubmit}>
        <div className='mt-3'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
       <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit" className='bg-blue-600 w-full text-white p-3 rounded-full'>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
};

export default AdminLogin;
