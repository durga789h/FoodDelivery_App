"use client"
import React,{useState} from 'react'
import RestaurantLogin from '../_components/restaurantLogin'
import RestaurantSignUp from '../_components/restaurantSignUp'
//import RestaurantHeader from '../_components/RestaurantHeader';
import RestaurantFooter from '../_components/RestaurantFooter';
import Link from 'next/link';


function Restaurant() {
  const[login,setLogin]=useState(true);
  return (
    <div>
     
    <div className='flex  justify-center my-10 mt-11'>

      <div className='flex flex-col items-center justify-center bg-slate-200 border border-gray-200 p-3'>
     
      <h1 className='text-fuchsia-500 text-3xl text-center'>Restaurant Login/Signup page</h1>
      <Link rel="stylesheet" href="/" className='bg-gradient-to-br text-white mt-2 from-fuchsia-700 to-blue-600 p-3 rounded-lg'  >Home</Link>
      {
        login?<RestaurantLogin/>:<RestaurantSignUp/>
      }
     <p className='flex justify-center'>
      <button onClick={()=>setLogin(!login)} className=' mt-[10px] bg-gradient-to-tr from-yellow-700 to-green-700 p-3 rounded-md text-white w-[400px]'>
        {login?"Do not have Account?Signup":"Already have Account?Signup"}
      </button> </p>
      </div>
    </div>
    <RestaurantFooter/>
    </div>
  )
}

export default Restaurant