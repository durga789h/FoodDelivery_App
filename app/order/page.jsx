//app/order/page.jsx
"use client";
import React, { useEffect, useState } from 'react';
import CustomerHeader from '../_components/CustomerHeader';
import RestaurantFooter from '../_components/RestaurantFooter';
import { TAX, DELIVERY_CHARGES } from '../lib/constant.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginLeft: '20%',
  marginRight: '50%',
  padding: '8px 0', // Adding some padding for vertical spacing
};
const rowStyle1 = {
  display: "flex",
  justifyContent: "flex-end",
  marginRight: "48%"
};

function Page() {
  const [userstorage, setUserStorage] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [cartStorage, setCartStorage] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
  const router = useRouter();

  const calculateTotal = (cartItems) => {
    if (cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  };

  const [total, setTotal] = useState(() => calculateTotal(cartStorage));

  useEffect(() => {
    if (cartStorage.length === 0) {
      router.push("/");
    }
  }, [cartStorage, router]);

  const totalPrice = total + (total * TAX) + DELIVERY_CHARGES;

  const orderNow = async () => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let city=JSON.parse(sessionStorage.getItem("user"));
  let  citys=city.city;
  console.log(citys)
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    let deliveryBoyResponse=await fetch("http://localhost:3000/api/deliverypartners/" +citys)
    deliveryBoyResponse=await deliveryBoyResponse.json()
   // console.log(deliveryBoyResponse)
  
   // let deliveryBoy_id = "664b3a100cb26e098d2195f6";
    let deliveryBoyIds=deliveryBoyResponse.result.map((item)=>item._id);
    console.log(deliveryBoyIds)
   let deliveryBoy_id=deliveryBoyIds[Math.floor(Math.random()*deliveryBoyIds.length)]
   //console.log(deliveryBoy_id)
   if(!deliveryBoy_id){
    toast.error("delivery partner not available")
    return false;
   }
    let foodItemIds = cart.map((item) => item._id).toString();
    let resto_id = cart[0].resto_id;

    let collection = {
      user_id: user.id,
      resto_id,
      foodItemIds,
      deliveryBoy_id,
      status: "confirm",
      amount: totalPrice.toFixed(2)
    };
//console.log(collection)
    const response = await axios.post("http://localhost:3000/api/ordercase", 
     (collection));
//console.log(response)
   // const data = await response.json();
//console.log(data)
    if (response.data.success) {
      toast.success("Order confirmed");
      sessionStorage.removeItem("cart"); // Ensure cart is removed from session storage here
      router.push("myprofile");
    } else {
      toast.error("Order failed");
    }
  };
 
  return (
    <div>
      <CustomerHeader />
      <ToastContainer />
      <div className="p-4 md:p-8 lg:p-12 mb-3"></div>
      <div className='flex flex-col border p-3 shadow-lg'>
        <div>
          <h2 className='text-xl text-red-600'>User Details:-</h2>
          <div style={rowStyle}>
            <span>Name</span>
            <span>{userstorage.name}</span>
          </div>
          <div style={rowStyle}>
            <span>Address</span>
            <span>{userstorage.address}</span>
          </div>
          <div style={rowStyle}>
            <span>Mobile</span>
            <span>{userstorage.mobile}</span>
          </div>
          <h2 className='text-xl text-red-600'>Amount Details:-</h2>
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
            <span>&#8377;{totalPrice.toFixed(2)}</span>
          </div>
          <h2 className='text-xl text-red-600'>Payment Methods:-</h2>
          <div style={rowStyle}>
            <span>Cash on delivery</span>
            <span>&#8377;{totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div style={rowStyle1}>
          <button 
            className='bg-gradient-to-br from-purple-600 to-blue-700 p-3 rounded-full text-white' 
            onClick={orderNow}
          >
            Place your Order Now
          </button>
        </div>
      </div>
      <RestaurantFooter />
    </div>
  );
}

export default Page;
