"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Restaurantdata = () => {
  const [restaurant, setRestaurant] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.push('/Admin/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/Admin/restaurant', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setRestaurant(response.data.result);
        console.log(response.data);
       
      } catch (error) {
        router.push('/Admin/login');
      }
    };

    fetchUsers();
  }, [router]);

  console.log(restaurant);

  const handleDelete = async (restaurantId) => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete('/api/Admin/restaurant', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { restaurantId },
      });
      setRestaurant(restaurant.filter((item) => item._id !== restaurantId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-fuchsia-800 underline">Restaurant-details</h1>
      <button
              onClick={() => router.push("/Admin/panel")}
              className="bg-pink-500 text-white px-4 mb-3 py-2 rounded-lg hover:bg-red-600 transition"
            >
             previous
            </button>
      <ul className="space-y-4">
        {restaurant.map((item) => (
          <li
            key={item._id}
            className="p-4 border rounded-lg shadow-sm flex justify-between items-center flex-col sm:flex-row"
          >
            <div className="flex-1 mb-2 sm:mb-0">
              <span className="block text-lg font-semibold">{item.name}</span>
              <span className="block text-gray-600">{item.email}</span>
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
              onClick={() => router.push("/Admin/panel")}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
             previous
            </button>
    </div>
  );
};

export default Restaurantdata;
