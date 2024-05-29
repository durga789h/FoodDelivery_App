"use client";
import React, { useState, useEffect } from 'react';
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
  const router = useRouter();
  const [userstorage, setUserStorage] = useState(() => JSON.parse(sessionStorage.getItem("user")));
  let city = JSON.parse(sessionStorage.getItem("user")).city;
  const [cartStorage, setCartStorage] = useState(() => JSON.parse(sessionStorage.getItem("cart")) || []);
  const [paymentMode, setPaymentMode] = useState("cash on delivery");
  const [removeCartData, setRemoveCartData] = useState(false); // Define the state for removeCartData

  const calculateTotal = (cartItems) => {
    if (cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  };

  const [total, setTotal] = useState(() => calculateTotal(cartStorage));

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartStorage(storedCart);
    setTotal(calculateTotal(storedCart));
  }, []);

  useEffect(() => {
    if (cartStorage.length === 0) {
      router.push("/");
    }
  }, [cartStorage]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createOrderId = async () => {
    try {
      const response = await fetch('/api/paymentorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          name: userstorage.name,
          email: userstorage.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const processPayment = async () => {
    if (!userstorage) {
      router.push("/user-auth?cart=true");
      return;
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const orderId = await createOrderId();

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        name: userstorage.name,
        description: 'description',
        order_id: orderId,
        handler: async function (response) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const res = await result.json();
          if (res.isOk) {
            toast.success(res.message);
            await placeOrder(orderId);  // Pass the orderId to placeOrder function
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: userstorage.name,
          email: userstorage.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      paymentObject.open();

    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cartStorage.filter(item => item._id !== id);
    setCartStorage(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setTotal(calculateTotal(updatedCart)); // Update total after removing an item
  };

  const totalPrice = total + (total * TAX) + DELIVERY_CHARGES;

  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const placeOrder = async (orderId) => {
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
      toast.success("Order confirmed");
      setRemoveCartData(true);
      sessionStorage.removeItem("cart");
      router.push(`/order-conformation?orderId=${orderId}&username=${userstorage.name}&address=${userstorage.address}&email=${userstorage.email}`);
    } else {
      toast.error("Order failed");
    }
  };

  const orderNow = async () => {
    if (JSON.parse(sessionStorage.getItem("user"))) {
      router.push("/order");
    } else {
      router.push("/user-auth?order=true");
    }
  };

  return (
    <div>
      <CustomerHeader removeCartData={removeCartData} />
      <ToastContainer />
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
            <span>&#8377;{totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div>
          <select size="1" className='w-[200px] p-3' onChange={handlePaymentModeChange} value={paymentMode}>
            <optgroup label="payment-mode">
              <option value="online">Online</option>
              <option value="cash on delivery">Cash on Delivery</option>
            </optgroup>
          </select>
        </div>
        <div style={rowStyle1}>
          {paymentMode === "online" && (
            <button className='bg-gradient-to-br from-purple-600 to-blue-700 p-3 rounded-full text-white' onClick={processPayment}>Pay now</button>
          )}
        </div>
        <div style={rowStyle1}>
          {paymentMode === "cash on delivery" && (
            <button 
              className='bg-gradient-to-br from-purple-600 to-blue-700 p-3 rounded-full text-white'
              onClick={orderNow}
            >
              Order Now
            </button>
          )}
        </div>
      </div>
      <RestaurantFooter />
    </div>
  );
}

export default Page;
