"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaUser, FaTruck, FaTimes } from 'react-icons/fa'; // Importing icons

function CustomerHeader(props) {
  const userstorage = sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user"));
  const [user, setUser] = useState(userstorage ? userstorage : "");
  const [cartStorage, setCartStorage] = useState(JSON.parse(sessionStorage.getItem("cart")) || []);
  const [cartNumber, setCartNumber] = useState(cartStorage.length);
  const [showHomeMenu, setShowHomeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartMenu, setShowCartMenu] = useState(false);
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

  const login = () => {
    router.push("/Delivery-main");
  };

  const handlesignup = () => {
    router.push("/deliverypartner");
  };

  return (
    <div className='flex justify-between items-center px-4 py-2'>
      <div>
        <img src="/food.jpg" width={80} alt="imgs" />
      </div>
      <ul className='hidden md:flex gap-5 text-cyan-600 text-xl'>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link href={"/myprofile"}>{user?.name}</Link>
            </li>
            {user.role === 1 && (
              <li>
                <Link href={"/Admin/login"}>Admin Dashboard</Link>
              </li>
            )}
            <li><button onClick={logout}>Logout</button></li>
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
        <li>
          {user ? <Link href={"MyOrder"}>My Order</Link> : ""}
        </li>
        <li>
          <Link href={"restaurant"}>Add Restaurant</Link>
        </li>
        <li>
          <select className='p-3 rounded-full bg-white'>
            <option value="Delivery Partner">Delivery Partners</option>
            <option value="sign-up" onClick={handlesignup}>Sign-up</option>
            <option value="sign-in" onClick={login}>Login</option>
          </select>
        </li>
      </ul>
      <div className='md:hidden flex items-center gap-4'>
        <div className='relative'>
          <button className='p-3 rounded-full bg-blue-500 text-white' onClick={() => setShowHomeMenu(!showHomeMenu)}>
            <FaHome />
          </button>
          {showHomeMenu && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2'>
              <div className='flex justify-between px-4 py-2'>
                <span>Menu</span>
                <button onClick={() => setShowHomeMenu(false)}>
                  <FaTimes />
                </button>
              </div>
              <Link href={"/"} className="block px-4 py-2 text-gray-800">Home</Link>
              {!user && (
                <>
                  <Link href={"/user-auth"} className="block px-4 py-2 text-gray-800">Login</Link>
                  <Link href={"/user-auth"} className="block px-4 py-2 text-gray-800">Signup</Link>
                </>
              )}
              {user && (
                <>
                  <Link href={"/myprofile"} className="block px-4 py-2 text-gray-800">{user?.name}</Link>
                  {user.role === 1 && (
                    <Link href={"/Admin/login"} className="block px-4 py-2 text-gray-800">Admin Dashboard</Link>
                  )}
                  <Link href={"restaurant"} className="block px-4 py-2 text-gray-800">Add Restaurant</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-800">Logout</button>
                </>
              )}
            </div>
          )}
        </div>
        <div className='relative'>
          <button className='p-3 rounded-full bg-blue-500 text-white' onClick={() => setShowUserMenu(!showUserMenu)}>
            <FaUser />
          </button>
          {showUserMenu && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2'>
              <div className='flex justify-between px-4 py-2'>
                <span>Delivery Menu</span>
                <button onClick={() => setShowUserMenu(false)}>
                  <FaTimes />
                </button>
              </div>
              <button onClick={handlesignup} className="block w-full text-left px-4 py-2 text-gray-800">Delivery Signup</button>
              <button onClick={login} className="block w-full text-left px-4 py-2 text-gray-800">Delivery Login</button>
              {user && (
                <Link href={"/MyOrder"} className="block px-4 py-2 text-gray-800">{user?.name}(online-order)</Link>
              )}
            </div>
          )}
        </div>
        <div className='relative'>
          <button className='p-3 rounded-full bg-blue-500 text-white' onClick={() => setShowCartMenu(!showCartMenu)}>
            <FaTruck />
          </button>
          {showCartMenu && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2'>
              <div className='flex justify-between px-4 py-2'>
                <span>Cart</span>
                <button onClick={() => setShowCartMenu(false)}>
                  <FaTimes />
                </button>
              </div>
              <Link href={cartNumber ? "/cart" : "#"} className="block px-4 py-2 text-gray-800">Cart({cartNumber ? cartNumber : 0})</Link>
              {cartStorage.map((item, index) => (
                <div key={index} className="px-4 py-2 text-gray-800">
                  {item.name} - {item.quantity}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerHeader;
