"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CustomerHeader from '../_components/CustomerHeader';

const banners = {
  backgroundImage: "url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2stcGYtcG9tLTEyNDIuanBn.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: "darken",
  backgroundColor: "rgba(0,0,0,0.8)",
  height: '400px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    loadLocations();
    loadRestaurants();
  }, []);

  const loadLocations = async () => {
    let response = await fetch("http://localhost:3000/api/customer/locations");
    const data = await response.json();
    if (data.success) {
      setLocations(data.result);
    }
  };

  const loadRestaurants = async (params) => {
    let url = "http://localhost:3000/api/customer";
    if (params?.location) {
      url = url + "?location=" + params.location;
    } else if (params?.restaurant) {
      url = url + "?restaurant=" + params.restaurant;
    }
    let response = await fetch(url);
    const data = await response.json();
    if (data.success) {
      setRestaurants(data.result);
    }
  };

  const handleListItem = (item) => {
    setSelectedLocation(item);
    setShowLocation(false); // for close
    loadRestaurants({ location: item });
  };

  const splitAddress = (address) => {
    const words = address.split(' ');
    const chunks = [];

    for (let i = 0; i < words.length; i += 5) {
      chunks.push(words.slice(i, i + 5).join(' '));
    }

    const firstChunk = chunks[0];
    const remainingChunks = chunks.slice(1);

    return { firstChunk, remainingChunks };
  };

  return (
    <div>
      <CustomerHeader />
      <div style={banners} className="flex flex-col items-center justify-center">
        <div className="outline-none gap-5 p-7 mt-[-90px] text-center">
          <h1 className="text-red-800 text-2xl mb-5">Food Delivery App</h1>
          <input 
            type="text" 
            value={selectedLocation} 
            onChange={handleListItem}
            onClick={() => setShowLocation(true)} 
            placeholder="Select place" 
            className="p-3 outline-none w-full max-w-md mb-3" 
          />
          <input 
            type="text"
            onChange={(e) => loadRestaurants({ restaurant: e.target.value })}
            placeholder="Enter food or restaurant name" 
            className="p-3 outline-none w-full max-w-md mb-3" 
          />
          {showLocation && (
            <ul className="bg-white w-full max-w-md p-0 cursor-pointer border">
              {locations.map((item, i) => (
                <li key={i} className="border-b p-2 hover:bg-gray-200" onClick={() => handleListItem(item)}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-wrap gap-3 justify-center">
        {restaurants.map((item, index) => {
          const { firstChunk, remainingChunks } = splitAddress(item.address);
          return (
            <div 
              onClick={() => router.push("explore/" + item.name + "?id=" + item._id)} 
              key={index}
              className="bg-gradient-to-bl from-green-700 to-white p-4 mb-4 rounded cursor-pointer w-full max-w-sm"
            >
              <div className="flex flex-col text-white">
                <h1 className="text-xl text-red-800">Restaurant name: {item.name}</h1>
                <h2 className="text-pink-800 mt-3">Phone: {item.phone}</h2>
                <h2 className="text-fuchsia-950">Email: {item.email}</h2>
              </div>
              <div className="flex flex-col text-white">
                <h2 className="text-red-950">Address: {firstChunk}</h2>
                {remainingChunks.length > 0 && (
                  <div>
                    {remainingChunks.map((chunk, chunkIndex) => (
                      <h2 className="text-yellow-800" key={chunkIndex}>{chunk}</h2>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
