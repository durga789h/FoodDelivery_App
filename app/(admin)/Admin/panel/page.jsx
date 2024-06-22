"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaHome, FaUserShield } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { SlLogout } from "react-icons/sl";

export default function Page() {
  
  const logout=()=>{
    sessionStorage.removeItem("token")
    router.push("/");
  }
  const router = useRouter();
  return (
    <div className="bg-fuchsia-700 text-white text-2xl h-[100vh] flex flex-col items-center sm:w-64 w-full">
      <div className="p-3 w-full">
        <h2 className="mt-2 flex items-center cursor-pointer" onClick={() => router.push("/Admin-user")}>
          <FaUserShield className="mr-2" /> User Details
        </h2>
        <h2 className="mt-10 flex items-center cursor-pointer" onClick={() => router.push("/restaurants")}>
          <IoRestaurant className="mr-2" /> Restaurants Details
        </h2>
        <h2 className="mt-10 flex items-center cursor-pointer" onClick={() => router.push("/delivery-boy")}>
          <TbTruckDelivery className="mr-2" /> Delivery Details
        </h2>
        <h2 className="mt-10 flex items-center cursor-pointer" onClick={() => router.push("/")}>
          <FaHome className="mr-2" /> Home
        </h2>
        <h2 className="mt-10 flex items-center cursor-pointer" onClick={logout}>
         <SlLogout className ="mr-2" /> Logout
        </h2>
      </div>
    </div>
  );
}
