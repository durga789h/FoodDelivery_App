"use client"
import CustomerHeader from '../_components/CustomerHeader';
import RestaurantFooter from '../_components/RestaurantFooter';
import UserSignup from '../_components/UserSignup';
import UserLogin from '../_components/UserLogin';
import { useState } from 'react';
function UserAuth(props){
    const[login,setLogin]=useState(true);
    console.log("order flag",props)
    return (
        <div className="flex flex-col min-h-screen">
            <CustomerHeader/>
            <div className='text-center mb-5'>
            <h1>User</h1>
{
    login?<UserLogin redirect={props.searchParams}/>:  <UserSignup redirect={props.searchParams}/>
}
<p className='flex justify-center'>
      <button onClick={()=>setLogin(!login)} className=' mt-[10px] bg-gradient-to-tr
       from-yellow-700 to-green-700 p-3 rounded-md text-white w-[400px]'>
        {login?"Do not have Account?Signup":"Already have Account?Signup"}
      </button> </p>
            </div>
          
            <RestaurantFooter/>
        </div>
    )
}
export default UserAuth