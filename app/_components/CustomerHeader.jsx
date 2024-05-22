"use client"
import Link from 'next/link'
import React, {  useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';


function CustomerHeader(props) {
  const userstorage=JSON.parse(sessionStorage.getItem("user"));
  const [user,setUser]=useState(userstorage?userstorage:undefined)
  const cartStorage=JSON.parse(sessionStorage.getItem("cart"))
const[cartNumber,setCardNumber]=useState(cartStorage?.length);
const[cartItem,setCartItem]=useState(cartStorage);
const router=useRouter();

//add cart data
useEffect(()=>{
  if(props.cartData){
    console.log(props)
    if(cartNumber){
      if(cartItem[0].resto_id!=props.cartData.resto_id){
sessionStorage.removeItem("cart")
setCardNumber(1)
setCartItem([props.cartData])
sessionStorage.setItem("cart",JSON.stringify([props.cartData]))
      }
      else{
        let localCartItem=cartItem;
        localCartItem.push(JSON.parse(JSON.stringify(props.cartData)))
        setCartItem(localCartItem)
        setCardNumber(cartNumber+1)
        sessionStorage.setItem("cart",JSON.stringify(localCartItem))
      }
 

    }else{
      setCardNumber(1)
      setCartItem([props.cartData])
      sessionStorage.setItem("cart",JSON.stringify([props.cartData]))
    }
   
  }
 
},[props.cartData])

//remove cart item
useEffect(()=>{
if(props.removeCartData){
  let localCartItem=cartItem.filter((item)=>{
return item._id!=props.removeCartData
  })
  setCartItem(localCartItem)
  setCardNumber(cartNumber-1)
  sessionStorage.setItem("cart",JSON.stringify(localCartItem))
  if(localCartItem.length==0){
 sessionStorage.removeItem("cart")
  }
}
},[props.removeCartData])

const logout=()=>{
  sessionStorage.removeItem("user")
  router.push("/user-auth")
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
{ 
user? <>
  <li>
        ({user?.name})
       </li>
      <li> <button onClick={logout}>logout</button> </li>
</>
:<>
 <li>
    <Link href={"/user-auth"}>Login</Link>
       </li>
  <li><Link href={"/user-auth"}>Signup</Link></li>
</>

}
     
    

      <li>
        <Link href={cartNumber?"/cart":"#"}>Card({cartNumber?cartNumber:0})</Link></li>
      
      Add Restaurant
      </ul>
    </div>
  )
}

export default CustomerHeader
