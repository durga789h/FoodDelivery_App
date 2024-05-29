"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function DeliveryHeader(props) {
  const [delivery,setDelivery]=useState("")
  const data=JSON.parse(sessionStorage.getItem("delivery"))
  useEffect(()=>{
  setDelivery(data)
  },[])
 const router=useRouter();
const handleout=()=>{
  sessionStorage.removeItem("delivery")
  router.push("/")
}

  return (
    <div className='flex gap-44'>
      <div>
        <img src="/food.jpg" width={80} alt="imgs" />
      </div>
      <ul className='md:flex gap-5 text-cyan-600 text-xl'>
        <li>
          <Link href={"/"}>Home</Link>
      
        </li>
{
  delivery?<li>
  <Link href={"/geolocation"}>DeliveryLocation</Link>
</li>:""
}
        <li onClick={handleout} className='cursor-pointer'>
         logout
        </li>
      </ul>
    </div>
  );
}

export default DeliveryHeader;
