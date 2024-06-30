"use client";
import React, { useEffect, useState } from 'react';
import CustomerHeader from '../_components/CustomerHeader';
import RestaurantFooter from '../_components/RestaurantFooter';

function Page() {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side-only code
      getMyOrder();
    }
  }, []);

  const getMyOrder = async () => {
    const userstorage = JSON.parse(sessionStorage.getItem("user"));
    if (userstorage) {
      console.log(userstorage);
      let response = await fetch(`http://localhost:3000/api/ordercase?id=${userstorage.id}`);
      response = await response.json();
      if (response.success) {
        setMyOrders(response.result);
      }
    }
  };

  console.log(myOrders);

  return (
    <div>
      <CustomerHeader />
      <div className="p-4 md:p-8 lg:p-12 mb-3">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="space-y-4">
          {myOrders.map((item, i) => (
            <div key={i} className="border p-4 rounded shadow-lg bg-white">
              <h4 className="text-lg font-semibold">Restaurant name: {item.data.name}</h4>
              <p><span className="font-semibold">email:</span> {item.data.email}</p>
              <p><span className="font-semibold">Restaurant address:</span> {item.data.address}</p>
              <p><span className="font-semibold">phone no:</span> {item.data.phone}</p>
              <p><span className="font-semibold">Status:</span> {item.status}</p>
              <p><span className="font-semibold">Amount:</span> &#8377;{item.amount}</p>
            </div>
          ))}
        </div>
      </div>
      <RestaurantFooter />
    </div>
  );
}

export default Page;
