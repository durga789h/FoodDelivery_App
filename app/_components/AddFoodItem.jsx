import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddFoodItem(props) {
  const [fooditems, setFoodItems] = useState({
    name: '',
    price: '',
    path: null,
    description: '',
  });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'path') {
      setFoodItems((prevState) => ({
        ...prevState,
        path: files[0],
      }));
    } else {
      setFoodItems((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddFoodItem = async () => {
    if (!fooditems.name || !fooditems.price || !fooditems.path || !fooditems.description) {
      setError(true);
      return false;
    } else {
      setError(false);
    }

    const restaurantData = sessionStorage.getItem('userid');
    let resto_id = '';
    if (restaurantData) {
      resto_id = restaurantData.replace(/^"|"$/g, '');
    }

    const formData = new FormData();
    formData.append('name', fooditems.name);
    formData.append('price', fooditems.price);
    formData.append('description', fooditems.description);
    formData.append('path', fooditems.path); // Append the file
    formData.append('resto_id', resto_id);

    try {
      const response = await fetch('http://localhost:3000/api/restaurants/foods', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      console.log(responseData)
      if (response.ok) {
        toast('Food item added successfully');
        props.setAddItem(false);
      } else {
        toast('Failed to add food item');
      }
    } catch (error) {
      console.error('Error adding food item:', error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className='text-center'>Add New Food item</h1>
      <div className='mx-4 md:mx-auto md:w-[400px] mt-5'>
        <div>
          <input type='text' placeholder='Enter Food name' name='name' value={fooditems.name} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
          {error && !fooditems.name && <span className='text-red-500'>Please enter valid name</span>}
        </div>
        <div>
          <input type='text' placeholder='Enter Food price' name='price' value={fooditems.price} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
          {error && !fooditems.price && <span className='text-red-500'>Please enter valid price</span>}
        </div>
        <div>
          <input type='file' name='path' onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
          {error && !fooditems.path && <span className='text-red-500'>Please enter valid path</span>}
        </div>
        <div>
          <input type='text' placeholder='Enter Food description' name='description' value={fooditems.description} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
          {error && !fooditems.description && <span className='text-red-500'>Please enter valid description</span>}
        </div>
        <div className='flex justify-center text-white mt-3'>
          <button onClick={handleAddFoodItem} className='bg-orange-500 p-3 rounded-full'>Add Food Items</button>
        </div>
      </div>
    </div>
  );
}
