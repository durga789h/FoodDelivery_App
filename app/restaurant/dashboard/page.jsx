"use client"
import AddFoodItem from '../../_components/AddFoodItem';
import FoodItemList from '../../_components/FoodItemList';

import React, { useState } from 'react'
import RestaurantHeader from '../../_components/RestaurantHeader';


function Dashboard() {
    const[addItem,setAddItem]=useState(false);
  return (
    <div className='mt-5'>

<RestaurantHeader/>
<button className='bg-purple-700 p-3 rounded-lg text-white mr-4' onClick={()=>setAddItem(true)}>Add Food</button>
<button  className='bg-purple-700 p-3 rounded-lg text-white mr-4' onClick={()=>setAddItem(false)} >Dashboard</button>
{addItem? <AddFoodItem setAddItem={setAddItem}/>: <FoodItemList/>

}
    </div>
  )
}

export default Dashboard