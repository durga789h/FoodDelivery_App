"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditFoodItem(props) {
   const router=useRouter();
   const { params } = props;
    const [fooditems, setFoodItems] = useState({
        name: "",
        price: "",
        path: "",
        description: "",
    });
    const[error,setError]=useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFoodItems(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
         const getfooddata =async()=>{
            const response=await fetch(`http://localhost:3000/api/restaurants/foods/edit/${params.id}`)
            const data=await response.json();
            
            if(response.ok){
              // console.log(data)
               setFoodItems(data.result)
            }
        }
        getfooddata();
       
    },[])
  
     const restaurantData = sessionStorage.getItem("userid");
     let resto_id = "";
     if (restaurantData) {
         resto_id = restaurantData.replace(/^"|"$/g, '');
     }

     const requestData = {
         ...fooditems,
         resto_id: resto_id
     };
      

    const handleEditFoodItem = async () => {
        if(!fooditems.name && !fooditems.price && !fooditems.path && !fooditems.description){
            setError(true)
            return false;
            
         }
         else{
             setError(false);
         }
         
         console.log(fooditems);
        
        try {
            const response = await fetch(`http://localhost:3000/api/restaurants/foods/edit/${params.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            console.log(response)

            const responseData = await response.json();
            console.log(responseData);
          


            if (response.ok) {
                setFoodItems(responseData.result);
                toast("Food item UPDATED successfully");
                router.push("../dashboard")
                
            } else {
                toast("Failed to edit/update food item");
            }
        } catch (error) {
            console.log(error)
        }
     
    };

    return (
       
        <div className=''>
            <ToastContainer/>
            <h1 className='text-center'>update Food item</h1>
            <div className="mx-4 md:mx-auto md:w-[400px] mt-7">
                <div>
                    <input type="text" placeholder='Enter Food name' name="name" value={fooditems.name} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
               {(error && !fooditems.name) && <span className='text-red-500'> Please enter valid name</span>}
                </div>


                <div>
                    <input type="text" placeholder='Enter Food price' name="price" value={fooditems.price} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
                    {(error && !fooditems.price) && <span className='text-red-500'> Please enter valid price</span>}
                </div>
                <div>
                    <input type="text" placeholder='Enter Food path' name='path' value={fooditems.path} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
                    {(error && !fooditems.path) && <span className='text-red-500'> Please enter valid path</span>}
                  </div>
                <div>
                    <input type="text" placeholder='Enter Food description' name='description' value={fooditems.description} onChange={handleChange} className='w-full md:w-[400px] p-3 mt-2 mb-2 rounded-md border-orange-500 border' />
                    {(error && !fooditems.description) && <span className='text-red-500'> Please enter valid description</span>}
                </div>
               
                <div className='flex justify-center text-white mt-3'>
                    <button onClick={handleEditFoodItem} className='bg-gradient-to-br from-blue-700 to-purple-700 p-3 rounded-full'>update Food Items</button>
                </div>

                <div className='flex justify-center text-white mt-3'>
                    <button onClick={()=>router.push("../dashboard")} className='bg-gradient-to-tr from-green-500 to-purple-700 p-3 rounded-full'>Back to Food Items List</button>
                </div>
               
               
            </div>
        </div>
       
    );
}
