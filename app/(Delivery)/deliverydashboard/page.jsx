"use client";
import React, { useEffect, useState } from 'react';
import DeliveryHeader from '../DeliveryHeader';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the OpenLayersMap component with no SSR
const OpenLayersMap = dynamic(() => import('../../_components/OpenLayersMap'), {
  ssr: false,
});

export default function Page() {
  const [cashOnDeliveryOrders, setCashOnDeliveryOrders] = useState([]);
  const [onlinePaymentOrders, setOnlinePaymentOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const delivery = JSON.parse(sessionStorage.getItem("delivery"));
      console.log("Delivery from sessionStorage:", delivery);
      if (!delivery) {
        router.push("deliverypartner");
      } else {
        const deliveryId = delivery.data.id;
        console.log("Delivery ID:", deliveryId);
        fetchCashOnDeliveryOrders(deliveryId);
        fetchOnlinePaymentOrders(deliveryId);
      }
    }
  }, [router]);

  const fetchCashOnDeliveryOrders = async (deliveryId) => {
    try {
      let response = await fetch(`/api/deliverypartners/orders/caseonDelivery/${deliveryId}`);
      let data = await response.json();
      console.log("Cash on Delivery Orders Response Data:", data);

      if (data.success) {
        setCashOnDeliveryOrders(data.result);
      } else {
        console.error("Failed to fetch cash on delivery orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cash on delivery orders:", error);
    }
  };

  const fetchOnlinePaymentOrders = async (deliveryId) => {
    try {
      let response = await fetch(`/api/deliverypartners/orders/onlinepayment/${deliveryId}`);
      let data = await response.json();
      console.log("Online Payment Orders Response Data:", data);

      if (data.success) {
        setOnlinePaymentOrders(data.result);
      } else {
        console.error("Failed to fetch online payment orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching online payment orders:", error);
    }
  };

  const combinedOrders = [...cashOnDeliveryOrders, ...onlinePaymentOrders];
  console.log("Combined Orders:", combinedOrders);

  return (
    <div>
      <DeliveryHeader />
      <h1>My Order List</h1>
      {combinedOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        combinedOrders.map((item, i) => (
          <div key={i} className="border p-4 rounded shadow-lg bg-white">
            <h4 className="text-lg font-semibold">Restaurant name: {item.data.name}</h4>
            <p><span className="font-semibold">Email:</span> {item.data.email}</p>
            <p><span className="font-semibold">Restaurant address:</span> {item.data.address}</p>
            <p><span className="font-semibold">Phone no:</span> {item.data.phone}</p>
            <p><span className="font-semibold">Status:</span> {item.status}</p>
            <p><span className="font-semibold">Amount:</span> &#8377;{item.amount}</p>
            <p>
              <select className='p-3'>
                <option value="confirm">confirm</option>
                <option value="on the way">on the way</option>
                <option value="Delivered">Delivered</option>
                <option value="fail to deliver">failed to deliver</option>
              </select>
            </p>
          </div>
        ))
      )}
      <h2>Order Locations</h2>
      <OpenLayersMap orders={combinedOrders} />
    </div>
  );
}
