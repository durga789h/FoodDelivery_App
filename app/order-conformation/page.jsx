"use client"

import { CheckCircle2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function OrderConfirmation(props) {
  const router=useRouter();
 
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const username = searchParams.get('username');
  const address = searchParams.get('address');
  const email=searchParams.get("email");
  return (
    <div className='flex justify-center my-20'>
      <div className='border shadow-md flex flex-col justify-center p-20 rounded-md
      items-center gap-3 px-32'>
        <CheckCircle2 className='h-24 w-24 text-green-700'/>
        <h2 className='font-medium text-3xl text-green-700'>Order successfully</h2>
        <h2>Thank you so much for order</h2>
        <h2>Order ID: {orderId}</h2>
        <h2>Username: {username}</h2>
        <h2>Address: {address}</h2>
        <h2>Email:{email}</h2>
        <button className='mt-8 bg-green-600 p-3 rounded-full text-white' onClick={()=>router.push("/MyOrder")}> Track your order</button>
      </div>
    </div>
  )
}
