"use client"
import React, { useState } from 'react';
//import { useRouter } from 'next/router';
import Link from 'next/link';

const DeliveryHeader = () => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  //const router = useRouter();

 

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeliveryLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className='flex gap-44'>
      
      <div>
        <img src="/food.jpg" width={80} alt="imgs" />
      </div>
      <ul className='md:flex gap-5 text-cyan-600 text-xl'>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
     
        <li>
          <button onClick={getLocation}>Get Delivery Location</button>
          {deliveryLocation && (
            <div>
              <p>Latitude: {deliveryLocation.latitude}</p>
              <p>Longitude: {deliveryLocation.longitude}</p>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default DeliveryHeader;
