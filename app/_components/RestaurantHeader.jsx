"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';


function RestaurantHeader() {
  const[details,setDetails]=useState("");
  const Router=useRouter();
  //const [key, setKey] = useState(0); // Key to trigger re-render
  useEffect(()=>{
    let data=sessionStorage.getItem("username")
    if(!data){
      Router.push("/")
    }
    else{
      setDetails(JSON.parse(data))
    }
  })
 // console.log(details)

 const handlebutton=()=>{

  sessionStorage.removeItem("username");
  sessionStorage.removeItem("jwt");
  setDetails("");
  
  //Router.push("/");
 }

  return (
    <div className='flex gap-44'>
      <div>
        <img src="/food.jpg" width={80} alt="imgs" />
      </div>
      <ul className='md:flex  gap-5 text-cyan-600 text-xl'>
        <li>
            <Link href={"/"}>Home</Link>
        </li>
       
        {details ?<> <li className='cursor-pointer' onClick={handlebutton}> logout({details})</li>
        <li>
            <Link href={"/"}  >Profile</Link>
        </li>
      </>
        :<li>
            <Link href={"/restaurant"} >Login/Signup</Link>
            
        </li>
        
        }
        
       
      </ul>
    </div>
  )
}

export default RestaurantHeader
