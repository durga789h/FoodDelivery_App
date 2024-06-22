"use client";
import React, { useState } from 'react';
import ForgetPassword from '../_components/forget-password';
import ResetPassword from '../(userdata-reset-password)/reset-password/page';

function Page() {
  const [showForgetPassword, setShowForgetPassword] = useState(true);

  return (
    <div className='container mx-auto mt-10'>
      <div className='flex justify-center'>
        <button 
          className='bg-purple-700 p-3 rounded-lg text-white mr-4'
          onClick={() => setShowForgetPassword(true)}>
          Forget Password
        </button>
        <button 
          className='bg-purple-700 p-3 rounded-lg text-white'
          onClick={() => setShowForgetPassword(false)}>
          Reset Password
        </button>
      </div>
      <div className='mt-10'>
        {showForgetPassword ? <ForgetPassword /> : <ResetPassword />}
      </div>
    </div>
  );
}

export default Page;
