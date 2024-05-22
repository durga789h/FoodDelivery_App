"use client";
import React, { useState } from 'react';
import CustomerHeader from '../_components/CustomerHeader';
import RestaurantFooter from '../_components/RestaurantFooter';
import  {TAX, DELIVERY_CHARGES } from '../lib/constant.js';

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginLeft: '20%',
  marginRight: '50%',
  padding: '8px 0', // Adding some padding for vertical spacing
};
const rowStyle1={
    display:"flex",
    justifyContent:"flex-end",
    marginRight:"48%"
}

function Page() {
   
  const [cartStorage, setCartStorage] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
  const[total]=useState(()=>cartStorage.length==1?cartStorage[0].price:cartStorage.reduce((a,b)=>
    {return a.price +b.price}))
console.log(total)

  const removeFromCart = (id) => {
    const updatedCart = cartStorage.filter(item => item._id !== id);
    setCartStorage(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const totalPrice = total + (total * TAX) + DELIVERY_CHARGES;

  return (
    <div>
      <CustomerHeader />
      <div className="p-4 md:p-8 lg:p-12 mb-3">
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartStorage.length > 0 ? 
            cartStorage.map((item, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-lg text-center">
                <img src={item.path} alt={item.name} className="w-full h-auto mt-2 rounded-md" />
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <h3 className="text-lg">₹{item.price}</h3>
                <p className="mt-2">{item.description}</p>
                <p className='mt-3'>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className='bg-gradient-to-br from-purple-600 to-blue-700 p-3 rounded-full text-white'
                  >
                    Remove from cart
                  </button>
                </p>
              </div>
            )) : 
            <h1>No food item found</h1>
          }
        </div>
      </div>
      <div className='flex flex-col border p-3 shadow-lg'>
        <div>
        <div style={rowStyle}>
          <span>Food charges:</span>
          <span>&#8377;{total}</span>
        </div>
        <div style={rowStyle}>
          <span>Tax:</span>
          <span>&#8377;{(total * TAX).toFixed(2)}</span>
        </div>
        <div style={rowStyle}>
          <span>Delivery charges:</span>
          <span>&#8377;{DELIVERY_CHARGES}</span>
        </div>
        <div style={rowStyle}>
          <span>Total Price:</span>
          <span>&#8377;{(totalPrice).toFixed(2)}</span>
        </div>
        </div>

        <div style={rowStyle1}>
            <button 
            className='bg-gradient-to-br
             from-purple-600 to-blue-700 p-3 rounded-full text-white'>Order Now</button>
        </div>
      </div>
      <RestaurantFooter />
    </div>
  );
}

export default Page;
