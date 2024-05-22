"use client";
import React, { useEffect, useState } from 'react';
import CustomerHeader from '../../_components/CustomerHeader';
import RestaurantFooter from '../../_components/RestaurantFooter';

const banners = {
  backgroundImage: "url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2stcGYtcG9tLTEyNDIuanBn.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: "darken",
  backgroundColor: "rgba(0,0,0,0.5)",
  height: '400px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

function Page(props) {
  const [restaurantDetails, setRestaurantDetails] = useState();
  const [foodItems, setFoodItems] = useState([]);
  const [cartData, setCartData] = useState();

  // Check if cartStorage is null and handle it
  const [cartStorage, setCartStorage] = useState(() => {
    const cart = sessionStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  });

  const [cartIds, setCartIds] = useState(() => cartStorage.map((item) => item._id));
  
  const[removeCartData,setRemoveCartData]=useState()
 // console.log(cartIds);

  const name = props.params.name;

  useEffect(() => {
    loadRestaurantDetails();
  }, []);

  const loadRestaurantDetails = async () => {
    const id = props.searchParams.id;
    const response = await fetch("http://localhost:3000/api/customer/" + id);
    const data = await response.json();
    if (data.success) {
      setRestaurantDetails(data.details);
      setFoodItems(data.foodItems);
    }
  };

  const addToCart = (item) => {
    setCartData(item);
    let localCartIds=cartIds;
    localCartIds.push(item._id)
    setCartIds(localCartIds)
    setRemoveCartData()
  };
  const removeFromCart=(id)=>{
  setRemoveCartData(id);
  var localIds=cartIds.filter(item=>item!=id)
  setCartData()
  setCartIds(localIds)

  }

  return (
    <div>
      <CustomerHeader cartData={cartData} removeCartData={removeCartData} />
      <div style={banners} className='mt-3'>
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">{decodeURI(name)}</h1>
      </div>
      <div className="p-4 md:p-8 lg:p-12">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl">Phone no:-{restaurantDetails?.phone}</h3>
        </div>
        <div className="mt-2">
          <h3 className="text-lg md:text-xl">City:-{restaurantDetails?.city}</h3>
          <h3 className="text-lg md:text-xl">Address:-{restaurantDetails?.address}</h3>
          <h3 className="text-lg md:text-xl">Email:-{restaurantDetails?.email}</h3>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {foodItems.length > 0 ? 
            foodItems.map((item, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-lg">
                <img src={item.path} alt={item.name} className="w-full h-auto mt-2 rounded-md" />
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <h3 className="text-lg">₹{item.price}</h3>
                <p className="mt-2">{item.description}</p>
                <p className='mt-3 text-white'>

                  {
                    cartIds.includes(item._id) ?  <button onClick={()=>removeFromCart(item._id)}
                    className='bg-gradient-to-br from-purple-600 to-blue-700 p-3 rounded-full' 
                   
                  >
                    Remove from cart
                  </button>:  <button 
                    className='bg-gradient-to-br from-purple-600 to-blue-700 p-3 rounded-full' 
                    onClick={() => addToCart(item)}
                  >
                    ADD TO CART
                  </button>
                  }
                 
                 
                </p>
              </div>
            )) : 
            <h1>No food item found</h1>
          }
        </div>
      </div>
      <RestaurantFooter/>
    </div>
  );
}

export default Page;
