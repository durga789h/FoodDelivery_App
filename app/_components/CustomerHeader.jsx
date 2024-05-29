"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function CustomerHeader(props) {
  const userstorage = sessionStorage.getItem("user")&& JSON.parse(sessionStorage.getItem("user"));
  const [user, setUser] = useState(userstorage ? userstorage : "");
  const [cartStorage, setCartStorage] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
  const [cartNumber, setCartNumber] = useState(cartStorage.length);
  const router = useRouter();

  // Add cart data
  useEffect(() => {
    if (props.cartData) {
      if (cartNumber) {
        if (cartStorage[0].resto_id !== props.cartData.resto_id) {
          sessionStorage.removeItem("cart");
          setCartNumber(1);
          setCartStorage([props.cartData]);
          sessionStorage.setItem("cart", JSON.stringify([props.cartData]));
        } else {
          const updatedCart = [...cartStorage, props.cartData];
          setCartStorage(updatedCart);
          setCartNumber(cartNumber + 1);
          sessionStorage.setItem("cart", JSON.stringify(updatedCart));
        }
      } else {
        setCartNumber(1);
        setCartStorage([props.cartData]);
        sessionStorage.setItem("cart", JSON.stringify([props.cartData]));
      }
    }
  }, [props.cartData]);

  // Clear cart after successful order
  useEffect(() => {
    if (props.removeCartData) {
      setCartStorage([]);
      setCartNumber(0);
      sessionStorage.removeItem("cart");
    }
  }, [props.removeCartData]);

  const logout = () => {
    sessionStorage.removeItem("user");
    router.push("/user-auth");
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
        {user ? (
          <>
            <li>
              <Link href={"/myprofile"}>
              ({user?.name})</Link> </li>
            <li><button onClick={logout}>logout</button></li>
          </>
        ) : (
          <>
            <li><Link href={"/user-auth"}>Login</Link></li>
            <li><Link href={"/user-auth"}>Signup</Link></li>
          </>
        )}
        <li>
          <Link href={cartNumber ? "/cart" : "#"}>Cart({cartNumber ? cartNumber : 0})</Link>
        </li>
        <li >
        <Link href={"MyOrder"}>My order</Link>
        </li>
        <li >
        <Link href={"restaurant"}>Add restaurant</Link>
        </li>
        <li>
          <Link href={"/deliverypartner"}>Delivery Partner</Link>
        </li>
      </ul>
    </div>
  );
}

export default CustomerHeader;
