//import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server';
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export  async function POST(request, res) {
  
      try {
       
        
        const { amount, name, email}=await request.json()
        
        //const amountInPaise = Math.round(amount * 100);
      //  
        const options = {
          amount:parseInt(amount)*100,
        // name:name,
           currency: 'INR',
          receipt: nanoid(),
          payment_capture: 1, // Auto capture payment after successful payment
         
        };
    
        // Create Razorpay order
        const order = await razorpay.orders.create(options);
        console.log(order);
        return NextResponse.json({orderId:order.id},{status:200})
      } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({error: 'Internal Server Error' },{status:500})
      }
    }