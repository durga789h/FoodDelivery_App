"use client";
import React, { useEffect, useState } from 'react';
import CustomerHeader from '../_components/CustomerHeader';
import RestaurantFooter from '../_components/RestaurantFooter';
import { TAX, DELIVERY_CHARGES } from '../lib/constant.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

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
  const [userstorage, setUserStorage] = useState(() => JSON.parse(sessionStorage.getItem("user")));
  let city = JSON.parse(sessionStorage.getItem("user")).city;
  const [cartStorage, setCartStorage] = useState(() => JSON.parse(sessionStorage.getItem("cart")) || []);
  const router = useRouter();

  let total = cartStorage.length === 1 
    ? cartStorage[0].price 
    : cartStorage.reduce((acc, item) => acc + item.price, 0);

  const [removeCartData, setRemoveCartData] = useState(false);

  useEffect(() => {
    if (cartStorage.length === 0) {
      router.push("/");
    }
  }, [cartStorage, router]);

  

  const totalPrice = total + (total * TAX) + DELIVERY_CHARGES;

  const orderNow = async () => {
    let user_id = userstorage.id;
    let cart = cartStorage;
    let deliveryBoyResponse = await fetch(`http://localhost:3000/api/deliverypartners/${city}`);
    deliveryBoyResponse = await deliveryBoyResponse.json();
    console.log(deliveryBoyResponse);

    let deliveryBoyIds = deliveryBoyResponse.result.map((item) => item._id);
    console.log(deliveryBoyIds);
    let deliveryBoy_id = deliveryBoyIds[Math.floor(Math.random() * deliveryBoyIds.length)];
    console.log(deliveryBoy_id);

    if (!deliveryBoy_id) {
      toast.error("Delivery partner not available");
      return false;
    }

    let foodItemIds = cart.map((item) => item._id).toString();
    let resto_id = cart[0].resto_id;

    let collection = {
      user_id,
      resto_id,
      foodItemIds,
      deliveryBoy_id,
      status: "confirm",
      amount: totalPrice.toFixed(2)
    };

    const response = await fetch("http://localhost:3000/api/orderonline", {
      method: "POST",
      body: JSON.stringify(collection),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      const orderId = data.orderId; // Assuming your API response contains the orderId
      toast.success("Order confirmed");
      setRemoveCartData(true);
      sessionStorage.removeItem("cart");
      router.push(`/order-conformation?orderId=${orderId}&username=${userstorage.name}&address=${userstorage.address}&email=${userstorage.email}`);
    } else {
      toast.error("Order failed");
    }
  };

  return (
    <div>
      <CustomerHeader removeCartData={removeCartData} />
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
            <span>Online conform payment</span>
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
