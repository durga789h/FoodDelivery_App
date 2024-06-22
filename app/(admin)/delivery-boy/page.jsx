"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Deliverydata= () => {
  const [delivery, setDelivery] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.push('/Admin/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/Admin/delivery', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        setDelivery(response.data.result);
        console.log(response.data)
       
      } catch (error) {
        router.push('/Admin/login');
      }
    };

    fetchUsers();
  }, []);
  //console.log(restaurant)

  const handleDelete = async (deliveryId) => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete('/api/Admin/delivery', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { deliveryId },
      });
      setDelivery(delivery.filter((delivery) => delivery._id !== deliveryId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center shadow-orange-700 text-red-800 underline">Delivery-boy-details</h1>
      <button
              onClick={() => router.push("/Admin/panel")}
              className="bg-red-500 text-white mb-3 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
             previous
            </button>
      <ul className="space-y-4">
        {delivery.map((item) => (
          <li key={item._id}  
          className="p-4 border rounded-lg shadow-sm flex justify-between items-center flex-col sm:flex-row">
            {item.name} - {item.mobile}

            <button className='bg-gradient-to-br from-fuchsia-700 to-orange-600 text-white p-3 mt-3' onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button
              onClick={() => router.push("/Admin/panel")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
             previous
            </button>
    </div>
  );
};

export default Deliverydata;
