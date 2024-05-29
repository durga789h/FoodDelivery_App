
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from "react"; 
import { useRouter } from 'next/navigation';
const FoodItemList = () => {
    const router=useRouter();
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFoodItems();
    }, []);

    const loadFoodItems = async () => {
        const restaurantData = sessionStorage.getItem("userid");
       // console.log(restaurantData)
        let resto_id = "";
        if (restaurantData) {
            resto_id = restaurantData.replace(/^"|"$/g, '');
        }
        try {
            const response = await fetch(`http://localhost:3000/api/restaurants/foods/${resto_id}`)              
        
            const data = await response.json();

            if (data.success) {
                setFoodItems(data.result);
            } else {
                setError("Failed to fetch food items");
            }
        } catch (err) {
            setError("Error fetching food items: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const deletefoodItems=async(id)=>{
        let response=await fetch("http://localhost:3000/api/restaurants/foods/"+id,{
            method:"DELETE"
        })
        const data = await response.json();
        if(data.success){
            loadFoodItems()
            toast.success("food data deleted successfully")
        }
        else{
            alert("food item not deleted")
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <ToastContainer/>
            <h1 className="text-center">Food Items</h1>
            <div className="mt-7 flex justify-center">
                <table className="border p-2">
                    <thead>
                        <tr>
                            <th className="border p-3">S.no</th>
                            <th className="border p-3">Name</th>
                            <th className="border p-3">&#8377;Price</th>
                            <th className="border p-3">Description</th>
                            <th className="border p-3">Image</th>
                           
                            <th className="border p-3">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map((item, index) => (
                            <tr key={item._id}>
                                <td className="border p-3">{index + 1}</td>
                                <td className="border p-3">{item.name}</td>
                                <td className="border p-3">&#8377;{item.price}</td>
                                <td className="border p-3">{item.description}</td>
                                <td className="border p-3">
                                    <img src={item.path} alt={item.name} width="50" height="50" />
                                </td>
                              {/*  <td className="border p-3">{item.resto_id}</td>  Displaying resto_id */}
                                <td className="border p-3">
                                    <button className="border p-2" onClick={()=>deletefoodItems(item._id)}>Delete</button>
                                    <button className="border p-2" onClick={()=>router.push("/restaurant/dashboard/"+item._id)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FoodItemList;
