"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  //const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.push('/Admin/login');
        return;
      }

      try {
        const response = await axios.get('/api/Admin/data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
       // setLoading(false);
      } catch (error) {
        router.push('/Admin/login');
      }
    };

    fetchUsers();
  }, [router]);

  const handleDelete = async (userId) => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete('/api/Admin/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  /*if (loading) {
    return <p>Loading...</p>;
  }*/

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-green-700 underline">Users details</h1>
      <button
              onClick={() => router.push("/Admin/panel")}
              className="bg-red-500 text-white px-4 mb-2 py-2 rounded-lg hover:bg-red-600 transition"
            >
             previous
            </button>
      <ul className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="p-4 border rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0"
          >
            <div className="flex-1">
              <span className="block text-lg font-semibold text-orange-700">{user.name}</span>
              <span className="block  text-red-800">{user.email}</span>
              <span className="block text-red-800">{user.address}</span>
              <span className="block text-red-800">{user.mobile}</span>
            </div>
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>

          </div>
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

export default AdminDashboard;
